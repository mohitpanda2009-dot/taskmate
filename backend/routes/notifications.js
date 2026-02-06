const { Router } = require('express');
const { param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const router = Router();

// All notification routes require authentication
router.use(authenticate);

/**
 * GET /api/notifications
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('unread_only').optional().isIn(['true', 'false']),
  ],
  validate,
  notificationController.listNotifications
);

/**
 * PUT /api/notifications/read-all
 * NOTE: This must be defined BEFORE /:id/read to avoid conflict
 */
router.put('/read-all', notificationController.markAllAsRead);

/**
 * PUT /api/notifications/:id/read
 */
router.put(
  '/:id/read',
  [param('id').isUUID().withMessage('Invalid notification ID')],
  validate,
  notificationController.markAsRead
);

module.exports = router;
