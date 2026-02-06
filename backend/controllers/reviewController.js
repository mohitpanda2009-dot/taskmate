const { Review, Task, User, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const { success, created, paginated } = require('../utils/apiResponse');
const { parsePagination } = require('../utils/helpers');
const { createNotification } = require('../utils/notifications');

/**
 * POST /api/reviews
 * Create a review (only after task is completed and confirmed)
 */
async function createReview(req, res, next) {
  try {
    const { task_id, rating, comment } = req.body;
    const reviewerId = req.userId;

    if (!task_id) throw ApiError.badRequest('task_id is required');
    if (!rating || rating < 1 || rating > 5) {
      throw ApiError.badRequest('Rating must be between 1 and 5');
    }

    const task = await Task.findByPk(task_id);
    if (!task) throw ApiError.notFound('Task not found');

    if (task.status !== 'completed') {
      throw ApiError.badRequest('Can only review completed tasks');
    }

    // Determine who is being reviewed
    let revieweeId;
    if (reviewerId === task.creator_id) {
      // Creator reviewing the doer
      revieweeId = task.doer_id;
    } else if (reviewerId === task.doer_id) {
      // Doer reviewing the creator
      revieweeId = task.creator_id;
    } else {
      throw ApiError.forbidden('You are not a participant of this task');
    }

    if (!revieweeId) {
      throw ApiError.badRequest('No user to review for this task');
    }

    // Check for duplicate review
    const existing = await Review.findOne({
      where: { task_id, reviewer_id: reviewerId },
    });
    if (existing) throw ApiError.conflict('You have already reviewed this task');

    const review = await Review.create({
      task_id,
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      rating,
      comment: comment || null,
    });

    // Update reviewee's average rating
    const result = await Review.findOne({
      where: { reviewee_id: revieweeId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
      ],
      raw: true,
    });

    await User.update(
      {
        rating: parseFloat(result.avg_rating).toFixed(2),
        total_reviews: parseInt(result.total, 10),
      },
      { where: { id: revieweeId } }
    );

    // Notify reviewee
    const reviewer = await User.findByPk(reviewerId, {
      attributes: ['name'],
    });

    const io = req.app.get('io');
    await createNotification({
      userId: revieweeId,
      type: 'review_received',
      title: 'New Review',
      body: `${reviewer.name || 'Someone'} gave you a ${rating}-star review.`,
      data: { task_id, review_id: review.id, rating },
      io,
    });

    // Reload with associations
    await review.reload({
      include: [
        { model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar_url'] },
        { model: User, as: 'reviewee', attributes: ['id', 'name', 'avatar_url'] },
        { model: Task, as: 'task', attributes: ['id', 'title'] },
      ],
    });

    return created(res, { review }, 'Review submitted');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/reviews/user/:id
 * Get reviews for a user
 */
async function getUserReviews(req, res, next) {
  try {
    const { id } = req.params;
    const { page, limit, offset } = parsePagination(req.query);

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'rating', 'total_reviews'],
    });
    if (!user) throw ApiError.notFound('User not found');

    const { rows, count } = await Review.findAndCountAll({
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
          attributes: ['id', 'title', 'category'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return paginated(res, { rows, count, page, limit });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReview,
  getUserReviews,
};
