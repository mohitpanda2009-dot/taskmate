const { Op } = require('sequelize');
const {
  Task,
  User,
  TaskApplication,
  Chat,
  Transaction,
  sequelize,
} = require('../models');
const ApiError = require('../utils/ApiError');
const { success, created, paginated } = require('../utils/apiResponse');
const { parsePagination, buildDistanceQuery, distanceLiteral } = require('../utils/helpers');
const { createNotification } = require('../utils/notifications');

/**
 * POST /api/tasks
 * Create a new task
 */
async function createTask(req, res, next) {
  try {
    const userId = req.userId;
    const user = req.user;

    // Check role
    if (user.role === 'doer') {
      throw ApiError.forbidden('Doers cannot create tasks. Switch to creator or both role.');
    }

    const { title, description, category, budget, latitude, longitude, address, deadline, images } = req.body;

    // Check wallet balance for escrow
    if (parseFloat(user.wallet_balance) < parseFloat(budget)) {
      throw ApiError.badRequest('Insufficient wallet balance. Please add funds.');
    }

    const task = await sequelize.transaction(async (t) => {
      // Create the task
      const newTask = await Task.create(
        {
          creator_id: userId,
          title,
          description,
          category,
          budget,
          latitude: latitude || null,
          longitude: longitude || null,
          address: address || null,
          deadline: deadline || null,
          images: images || [],
        },
        { transaction: t }
      );

      // Create escrow transaction — debit from creator's wallet
      await Transaction.create(
        {
          user_id: userId,
          task_id: newTask.id,
          type: 'escrow',
          amount: budget,
          status: 'completed',
          description: `Escrow for task: ${title}`,
        },
        { transaction: t }
      );

      // Debit wallet
      await User.update(
        {
          wallet_balance: sequelize.literal(
            `wallet_balance - ${parseFloat(budget)}`
          ),
        },
        { where: { id: userId }, transaction: t }
      );

      return newTask;
    });

    // Reload with associations
    const fullTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'avatar_url', 'rating'] },
      ],
    });

    // Emit task creation event for nearby doers
    const io = req.app.get('io');
    if (io) {
      io.emit('task:new', fullTask);
    }

    return created(res, { task: fullTask }, 'Task created successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/tasks
 * List tasks with filters
 */
async function listTasks(req, res, next) {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const {
      category,
      status,
      latitude,
      longitude,
      radius,
      budget_min,
      budget_max,
      search,
      sort_by,
    } = req.query;

    const where = {};
    const order = [];

    // Default: only open tasks
    where.status = status || 'open';

    // Category filter
    if (category) {
      where.category = category;
    }

    // Budget range
    if (budget_min || budget_max) {
      where.budget = {};
      if (budget_min) where.budget[Op.gte] = parseFloat(budget_min);
      if (budget_max) where.budget[Op.lte] = parseFloat(budget_max);
    }

    // Search
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Nearby filter
    const attributes = { include: [] };
    if (latitude && longitude) {
      const radiusKm = parseFloat(radius) || 50;
      where[Op.and] = [
        ...(where[Op.and] || []),
        sequelize.literal(buildDistanceQuery(latitude, longitude, radiusKm)),
      ];

      // Add distance column
      attributes.include.push([
        sequelize.literal(distanceLiteral(latitude, longitude)),
        'distance',
      ]);
    }

    // Sorting
    switch (sort_by) {
      case 'budget_high':
        order.push(['budget', 'DESC']);
        break;
      case 'budget_low':
        order.push(['budget', 'ASC']);
        break;
      case 'nearest':
        if (latitude && longitude) {
          order.push([sequelize.literal('"distance"'), 'ASC']);
        }
        break;
      case 'deadline':
        order.push(['deadline', 'ASC']);
        break;
      default:
        order.push(['created_at', 'DESC']);
    }

    const { rows, count } = await Task.findAndCountAll({
      where,
      attributes,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'avatar_url', 'rating'],
        },
      ],
      order,
      limit,
      offset,
      distinct: true,
    });

    return paginated(res, { rows, count, page, limit });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/tasks/my
 * My created tasks
 */
async function myTasks(req, res, next) {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { status } = req.query;

    const where = { creator_id: req.userId };
    if (status) where.status = status;

    const { rows, count } = await Task.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'doer',
          attributes: ['id', 'name', 'avatar_url', 'rating'],
        },
        {
          model: TaskApplication,
          as: 'applications',
          attributes: ['id', 'status'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return paginated(res, { rows, count, page, limit });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/tasks/:id
 * Task details
 */
async function getTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'avatar_url', 'rating', 'total_reviews'],
        },
        {
          model: User,
          as: 'doer',
          attributes: ['id', 'name', 'avatar_url', 'rating', 'total_reviews'],
        },
        {
          model: TaskApplication,
          as: 'applications',
          include: [
            {
              model: User,
              as: 'doer',
              attributes: ['id', 'name', 'avatar_url', 'rating', 'total_reviews'],
            },
          ],
        },
      ],
    });

    if (!task) throw ApiError.notFound('Task not found');

    // Only show applications to the creator
    const result = task.toJSON();
    if (req.userId !== task.creator_id) {
      // If user is a doer, only show their own application
      if (result.applications) {
        result.applications = result.applications.filter(
          (app) => app.doer_id === req.userId
        );
      }
    }

    return success(res, { task: result });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/tasks/:id
 * Update task (only open tasks by creator)
 */
async function updateTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) throw ApiError.notFound('Task not found');
    if (task.creator_id !== req.userId) throw ApiError.forbidden('Not your task');
    if (task.status !== 'open') throw ApiError.badRequest('Can only update open tasks');

    const allowedFields = ['title', 'description', 'category', 'latitude', 'longitude', 'address', 'deadline', 'images'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Budget update requires wallet adjustment
    if (req.body.budget !== undefined) {
      const newBudget = parseFloat(req.body.budget);
      const oldBudget = parseFloat(task.budget);
      const diff = newBudget - oldBudget;

      if (diff > 0) {
        const user = await User.findByPk(req.userId);
        if (parseFloat(user.wallet_balance) < diff) {
          throw ApiError.badRequest('Insufficient wallet balance for budget increase');
        }
      }

      await sequelize.transaction(async (t) => {
        if (diff !== 0) {
          // Adjust escrow
          await Transaction.create(
            {
              user_id: req.userId,
              task_id: task.id,
              type: diff > 0 ? 'escrow' : 'release',
              amount: Math.abs(diff),
              status: 'completed',
              description: `Budget adjustment for task: ${task.title}`,
            },
            { transaction: t }
          );

          await User.update(
            {
              wallet_balance: sequelize.literal(
                `wallet_balance - ${diff}`
              ),
            },
            { where: { id: req.userId }, transaction: t }
          );
        }

        updates.budget = newBudget;
        await task.update(updates, { transaction: t });
      });
    } else {
      await task.update(updates);
    }

    await task.reload({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'avatar_url', 'rating'] },
      ],
    });

    return success(res, { task }, 'Task updated');
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/tasks/:id
 * Cancel task (refund escrow)
 */
async function cancelTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) throw ApiError.notFound('Task not found');
    if (task.creator_id !== req.userId) throw ApiError.forbidden('Not your task');
    if (['completed', 'cancelled'].includes(task.status)) {
      throw ApiError.badRequest('Cannot cancel a completed or already cancelled task');
    }

    await sequelize.transaction(async (t) => {
      // Refund escrow to creator
      await Transaction.create(
        {
          user_id: req.userId,
          task_id: task.id,
          type: 'release',
          amount: task.budget,
          status: 'completed',
          description: `Escrow refund for cancelled task: ${task.title}`,
        },
        { transaction: t }
      );

      await User.update(
        {
          wallet_balance: sequelize.literal(
            `wallet_balance + ${parseFloat(task.budget)}`
          ),
        },
        { where: { id: req.userId }, transaction: t }
      );

      await task.update({ status: 'cancelled' }, { transaction: t });

      // Reject all pending applications
      await TaskApplication.update(
        { status: 'rejected' },
        { where: { task_id: task.id, status: 'pending' }, transaction: t }
      );
    });

    // Notify assigned doer if any
    const io = req.app.get('io');
    if (task.doer_id) {
      await createNotification({
        userId: task.doer_id,
        type: 'task_cancelled',
        title: 'Task Cancelled',
        body: `The task "${task.title}" has been cancelled by the creator.`,
        data: { task_id: task.id },
        io,
      });
    }

    if (io) {
      io.emit('task:cancelled', { taskId: task.id });
    }

    return success(res, { task }, 'Task cancelled and escrow refunded');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tasks/:id/apply
 * Apply for a task (doer)
 */
async function applyForTask(req, res, next) {
  try {
    const user = req.user;
    const taskId = req.params.id;

    if (user.role === 'creator') {
      throw ApiError.forbidden('Creators cannot apply for tasks. Switch to doer or both role.');
    }

    const task = await Task.findByPk(taskId);
    if (!task) throw ApiError.notFound('Task not found');
    if (task.status !== 'open') throw ApiError.badRequest('Task is not open for applications');
    if (task.creator_id === req.userId) throw ApiError.badRequest('Cannot apply for your own task');

    // Check duplicate application
    const existing = await TaskApplication.findOne({
      where: { task_id: taskId, doer_id: req.userId },
    });
    if (existing) throw ApiError.conflict('You have already applied for this task');

    const { message, proposed_budget } = req.body;

    const application = await TaskApplication.create({
      task_id: taskId,
      doer_id: req.userId,
      message: message || null,
      proposed_budget: proposed_budget || null,
    });

    // Notify task creator
    const io = req.app.get('io');
    await createNotification({
      userId: task.creator_id,
      type: 'task_application',
      title: 'New Application',
      body: `${user.name || 'A doer'} applied for "${task.title}"`,
      data: { task_id: taskId, application_id: application.id },
      io,
    });

    // Reload with doer info
    await application.reload({
      include: [
        { model: User, as: 'doer', attributes: ['id', 'name', 'avatar_url', 'rating'] },
      ],
    });

    return created(res, { application }, 'Application submitted');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/tasks/:id/applications
 * List applications for a task (creator only)
 */
async function listApplications(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw ApiError.notFound('Task not found');
    if (task.creator_id !== req.userId) throw ApiError.forbidden('Only the task creator can view applications');

    const applications = await TaskApplication.findAll({
      where: { task_id: task.id },
      include: [
        {
          model: User,
          as: 'doer',
          attributes: ['id', 'name', 'avatar_url', 'rating', 'total_reviews', 'verified'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return success(res, { applications });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/tasks/:id/applications/:appId
 * Accept or reject an application (creator only)
 */
async function handleApplication(req, res, next) {
  try {
    const { id: taskId, appId } = req.params;
    const { status: newStatus } = req.body;

    if (!['accepted', 'rejected'].includes(newStatus)) {
      throw ApiError.badRequest('Status must be accepted or rejected');
    }

    const task = await Task.findByPk(taskId);
    if (!task) throw ApiError.notFound('Task not found');
    if (task.creator_id !== req.userId) throw ApiError.forbidden('Not your task');
    if (task.status !== 'open') throw ApiError.badRequest('Task is no longer open');

    const application = await TaskApplication.findOne({
      where: { id: appId, task_id: taskId },
    });
    if (!application) throw ApiError.notFound('Application not found');
    if (application.status !== 'pending') throw ApiError.badRequest('Application already handled');

    const io = req.app.get('io');

    if (newStatus === 'accepted') {
      await sequelize.transaction(async (t) => {
        // Accept this application
        await application.update({ status: 'accepted' }, { transaction: t });

        // Assign doer to task
        await task.update(
          { status: 'assigned', doer_id: application.doer_id },
          { transaction: t }
        );

        // Reject all other pending applications
        await TaskApplication.update(
          { status: 'rejected' },
          {
            where: {
              task_id: taskId,
              id: { [Op.ne]: appId },
              status: 'pending',
            },
            transaction: t,
          }
        );

        // Create a chat between creator and doer
        await Chat.findOrCreate({
          where: {
            task_id: taskId,
            creator_id: task.creator_id,
            doer_id: application.doer_id,
          },
          transaction: t,
        });
      });

      // Notify accepted doer
      await createNotification({
        userId: application.doer_id,
        type: 'task_accepted',
        title: 'Application Accepted!',
        body: `Your application for "${task.title}" has been accepted.`,
        data: { task_id: taskId },
        io,
      });

      // Notify rejected applicants
      const rejectedApps = await TaskApplication.findAll({
        where: { task_id: taskId, status: 'rejected', id: { [Op.ne]: appId } },
        attributes: ['doer_id'],
      });

      for (const app of rejectedApps) {
        await createNotification({
          userId: app.doer_id,
          type: 'task_rejected',
          title: 'Application Update',
          body: `The task "${task.title}" has been assigned to another doer.`,
          data: { task_id: taskId },
          io,
        });
      }
    } else {
      await application.update({ status: 'rejected' });

      await createNotification({
        userId: application.doer_id,
        type: 'task_rejected',
        title: 'Application Rejected',
        body: `Your application for "${task.title}" was not accepted.`,
        data: { task_id: taskId },
        io,
      });
    }

    if (io) {
      io.emit('task:updated', { taskId: task.id, status: task.status });
    }

    return success(res, { application }, `Application ${newStatus}`);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tasks/:id/complete
 * Mark task as completed (doer)
 */
async function completeTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw ApiError.notFound('Task not found');
    if (task.doer_id !== req.userId) throw ApiError.forbidden('Only the assigned doer can complete this task');

    if (!['assigned', 'in_progress'].includes(task.status)) {
      throw ApiError.badRequest('Task must be assigned or in progress to mark as completed');
    }

    await task.update({ status: 'completed' });

    const io = req.app.get('io');
    await createNotification({
      userId: task.creator_id,
      type: 'task_completed',
      title: 'Task Completed',
      body: `The doer has marked "${task.title}" as completed. Please review and confirm.`,
      data: { task_id: task.id },
      io,
    });

    if (io) {
      io.emit('task:updated', { taskId: task.id, status: 'completed' });
    }

    return success(res, { task }, 'Task marked as completed. Waiting for creator confirmation.');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tasks/:id/confirm
 * Confirm completion — release payment (creator)
 */
async function confirmTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw ApiError.notFound('Task not found');
    if (task.creator_id !== req.userId) throw ApiError.forbidden('Only the task creator can confirm completion');
    if (task.status !== 'completed') throw ApiError.badRequest('Task must be marked as completed first');

    await sequelize.transaction(async (t) => {
      // Release payment to doer
      await Transaction.create(
        {
          user_id: task.doer_id,
          task_id: task.id,
          type: 'credit',
          amount: task.budget,
          status: 'completed',
          description: `Payment for task: ${task.title}`,
        },
        { transaction: t }
      );

      // Credit doer's wallet
      await User.update(
        {
          wallet_balance: sequelize.literal(
            `wallet_balance + ${parseFloat(task.budget)}`
          ),
        },
        { where: { id: task.doer_id }, transaction: t }
      );

      // Mark task as fully confirmed
      await task.update({ status: 'completed' }, { transaction: t });
    });

    const io = req.app.get('io');

    // Notify doer about payment
    await createNotification({
      userId: task.doer_id,
      type: 'payment_received',
      title: 'Payment Received',
      body: `₹${task.budget} has been credited for completing "${task.title}"`,
      data: { task_id: task.id, amount: parseFloat(task.budget) },
      io,
    });

    await createNotification({
      userId: task.creator_id,
      type: 'task_confirmed',
      title: 'Task Confirmed',
      body: `You confirmed "${task.title}". ₹${task.budget} released to the doer.`,
      data: { task_id: task.id },
      io,
    });

    if (io) {
      io.emit('task:confirmed', { taskId: task.id });
    }

    return success(res, { task }, 'Task confirmed and payment released');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTask,
  listTasks,
  myTasks,
  getTask,
  updateTask,
  cancelTask,
  applyForTask,
  listApplications,
  handleApplication,
  completeTask,
  confirmTask,
};
