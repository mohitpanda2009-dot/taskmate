const { Router } = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const chatController = require('../controllers/chatController');

const router = Router();

// All chat routes require authentication
router.use(authenticate);

/**
 * GET /api/chats
 */
router.get('/', chatController.listChats);

/**
 * GET /api/chats/:id/messages
 */
router.get(
  '/:id/messages',
  [
    param('id').isUUID().withMessage('Invalid chat ID'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  chatController.getMessages
);

/**
 * POST /api/chats/:id/messages
 */
router.post(
  '/:id/messages',
  [
    param('id').isUUID().withMessage('Invalid chat ID'),
    body('text')
      .optional()
      .isString()
      .isLength({ max: 5000 })
      .withMessage('Message must be under 5000 characters'),
    body('media_url')
      .optional()
      .isURL()
      .withMessage('Media URL must be valid'),
    body('media_type')
      .optional()
      .isIn(['image', 'video', 'file', 'location'])
      .withMessage('Invalid media type'),
  ],
  validate,
  chatController.sendMessage
);

module.exports = router;
