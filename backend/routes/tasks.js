const { Router } = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

const router = Router();

// All task routes require authentication
router.use(authenticate);

/**
 * POST /api/tasks
 */
router.post(
  '/',
  [
    body('title')
      .notEmpty()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be 3-200 characters'),
    body('description')
      .notEmpty()
      .isLength({ min: 10, max: 5000 })
      .withMessage('Description must be 10-5000 characters'),
    body('category')
      .notEmpty()
      .isIn([
        'form_filling',
        'delivery',
        'standing_in_line',
        'shopping',
        'document_work',
        'small_repairs',
        'driving',
        'photo_video',
        'other',
      ])
      .withMessage('Invalid category'),
    body('budget')
      .notEmpty()
      .isFloat({ min: 1 })
      .withMessage('Budget must be at least ₹1'),
    body('latitude')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('Invalid latitude'),
    body('longitude')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Invalid longitude'),
    body('address')
      .optional()
      .isString()
      .isLength({ max: 500 }),
    body('deadline')
      .optional()
      .isISO8601()
      .withMessage('Deadline must be a valid date'),
    body('images')
      .optional()
      .isArray()
      .withMessage('Images must be an array of URLs'),
  ],
  validate,
  taskController.createTask
);

/**
 * GET /api/tasks
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('category')
      .optional()
      .isIn([
        'form_filling',
        'delivery',
        'standing_in_line',
        'shopping',
        'document_work',
        'small_repairs',
        'driving',
        'photo_video',
        'other',
      ]),
    query('status')
      .optional()
      .isIn(['open', 'assigned', 'in_progress', 'completed', 'cancelled']),
    query('budget_min').optional().isFloat({ min: 0 }),
    query('budget_max').optional().isFloat({ min: 0 }),
    query('latitude').optional().isFloat({ min: -90, max: 90 }),
    query('longitude').optional().isFloat({ min: -180, max: 180 }),
    query('radius').optional().isFloat({ min: 0.1, max: 500 }),
    query('sort_by')
      .optional()
      .isIn(['newest', 'budget_high', 'budget_low', 'nearest', 'deadline']),
  ],
  validate,
  taskController.listTasks
);

/**
 * GET /api/tasks/my
 */
router.get('/my', taskController.myTasks);

/**
 * GET /api/tasks/:id
 */
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid task ID')],
  validate,
  taskController.getTask
);

/**
 * PUT /api/tasks/:id
 */
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid task ID'),
    body('title')
      .optional()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be 3-200 characters'),
    body('description')
      .optional()
      .isLength({ min: 10, max: 5000 })
      .withMessage('Description must be 10-5000 characters'),
    body('budget')
      .optional()
      .isFloat({ min: 1 })
      .withMessage('Budget must be at least ₹1'),
  ],
  validate,
  taskController.updateTask
);

/**
 * DELETE /api/tasks/:id
 */
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid task ID')],
  validate,
  taskController.cancelTask
);

/**
 * POST /api/tasks/:id/apply
 */
router.post(
  '/:id/apply',
  [
    param('id').isUUID().withMessage('Invalid task ID'),
    body('message')
      .optional()
      .isString()
      .isLength({ max: 1000 })
      .withMessage('Message must be under 1000 characters'),
    body('proposed_budget')
      .optional()
      .isFloat({ min: 1 })
      .withMessage('Proposed budget must be at least ₹1'),
  ],
  validate,
  taskController.applyForTask
);

/**
 * GET /api/tasks/:id/applications
 */
router.get(
  '/:id/applications',
  [param('id').isUUID().withMessage('Invalid task ID')],
  validate,
  taskController.listApplications
);

/**
 * PUT /api/tasks/:id/applications/:appId
 */
router.put(
  '/:id/applications/:appId',
  [
    param('id').isUUID().withMessage('Invalid task ID'),
    param('appId').isUUID().withMessage('Invalid application ID'),
    body('status')
      .notEmpty()
      .isIn(['accepted', 'rejected'])
      .withMessage('Status must be accepted or rejected'),
  ],
  validate,
  taskController.handleApplication
);

/**
 * POST /api/tasks/:id/complete
 */
router.post(
  '/:id/complete',
  [param('id').isUUID().withMessage('Invalid task ID')],
  validate,
  taskController.completeTask
);

/**
 * POST /api/tasks/:id/confirm
 */
router.post(
  '/:id/confirm',
  [param('id').isUUID().withMessage('Invalid task ID')],
  validate,
  taskController.confirmTask
);

module.exports = router;
