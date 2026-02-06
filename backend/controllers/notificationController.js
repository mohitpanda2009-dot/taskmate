const { Notification } = require('../models');
const ApiError = require('../utils/ApiError');
const { success, paginated } = require('../utils/apiResponse');
const { parsePagination } = require('../utils/helpers');

/**
 * GET /api/notifications
 * List user's notifications (paginated)
 */
async function listNotifications(req, res, next) {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { unread_only } = req.query;

    const where = { user_id: req.userId };
    if (unread_only === 'true') {
      where.read = false;
    }

    const { rows, count } = await Notification.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    // Also include unread count
    const unreadCount = await Notification.count({
      where: { user_id: req.userId, read: false },
    });

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: rows,
      unread_count: unreadCount,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/notifications/:id/read
 * Mark single notification as read
 */
async function markAsRead(req, res, next) {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!notification) throw ApiError.notFound('Notification not found');

    await notification.update({ read: true });

    return success(res, { notification }, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 */
async function markAllAsRead(req, res, next) {
  try {
    const [updatedCount] = await Notification.update(
      { read: true },
      { where: { user_id: req.userId, read: false } }
    );

    return success(res, { updated: updatedCount }, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listNotifications,
  markAsRead,
  markAllAsRead,
};
