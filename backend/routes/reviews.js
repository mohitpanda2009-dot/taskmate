const { Router } = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

const router = Router();

// All review routes require authentication
router.use(authenticate);

/**
 * POST /api/reviews
 */
router.post(
  '/',
  [
    body('task_id')
      .notEmpty()
      .isUUID()
      .withMessage('Valid task_id is required'),
    body('rating')
      .notEmpty()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .isString()
      .isLength({ max: 2000 })
      .withMessage('Comment must be under 2000 characters'),
  ],
  validate,
  reviewController.createReview
);

/**
 * GET /api/reviews/user/:id
 */
router.get(
  '/user/:id',
  [
    param('id').isUUID().withMessage('Invalid user ID'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  reviewController.getUserReviews
);

module.exports = router;
