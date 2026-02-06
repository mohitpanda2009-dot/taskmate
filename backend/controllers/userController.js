const { User, Review, Task, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const { success } = require('../utils/apiResponse');

/**
 * GET /api/users/me
 */
async function getMe(req, res, next) {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) throw ApiError.notFound('User not found');

    return success(res, { user: user.toProfileJSON() });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/users/me
 */
async function updateMe(req, res, next) {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) throw ApiError.notFound('User not found');

    const allowedFields = ['name', 'email', 'role', 'avatar_url', 'latitude', 'longitude'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Validate role
    if (updates.role && !['creator', 'doer', 'both'].includes(updates.role)) {
      throw ApiError.badRequest('Role must be creator, doer, or both');
    }

    await user.update(updates);

    return success(res, { user: user.toProfileJSON() }, 'Profile updated');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/users/onboarding
 */
async function completeOnboarding(req, res, next) {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) throw ApiError.notFound('User not found');

    if (user.onboarding_completed) {
      throw ApiError.badRequest('Onboarding already completed');
    }

    const { name, role, avatar_url, latitude, longitude } = req.body;

    if (!name || name.trim().length < 2) {
      throw ApiError.badRequest('Name is required (min 2 characters)');
    }

    if (!role || !['creator', 'doer', 'both'].includes(role)) {
      throw ApiError.badRequest('Role must be creator, doer, or both');
    }

    await user.update({
      name: name.trim(),
      role,
      avatar_url: avatar_url || null,
      latitude: latitude || null,
      longitude: longitude || null,
      onboarding_completed: true,
    });

    return success(res, { user: user.toProfileJSON() }, 'Onboarding completed');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/users/:id
 */
async function getUserProfile(req, res, next) {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'avatar_url', 'role', 'rating', 'total_reviews', 'verified', 'is_online', 'created_at'],
    });

    if (!user) throw ApiError.notFound('User not found');

    // Get task stats
    const [taskStats] = await sequelize.query(
      `SELECT
        COUNT(*) FILTER (WHERE creator_id = :userId) as tasks_created,
        COUNT(*) FILTER (WHERE doer_id = :userId AND status = 'completed') as tasks_completed
       FROM tasks
       WHERE creator_id = :userId OR doer_id = :userId`,
      {
        replacements: { userId: id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Get recent reviews
    const recentReviews = await Review.findAll({
      where: { reviewee_id: id },
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'name', 'avatar_url'],
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'title'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 5,
    });

    return success(res, {
      user: user.toJSON(),
      stats: {
        tasks_created: parseInt(taskStats.tasks_created, 10) || 0,
        tasks_completed: parseInt(taskStats.tasks_completed, 10) || 0,
      },
      recent_reviews: recentReviews,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMe,
  updateMe,
  completeOnboarding,
  getUserProfile,
};
