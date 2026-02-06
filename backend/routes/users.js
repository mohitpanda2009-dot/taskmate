const { Router } = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = Router();

// All user routes require authentication
router.use(authenticate);

/**
 * GET /api/users/me
 */
router.get('/me', userController.getMe);

/**
 * PUT /api/users/me
 */
router.put(
  '/me',
  [
    body('name')
      .optional()
      .isString()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be 2-100 characters'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format'),
    body('role')
      .optional()
      .isIn(['creator', 'doer', 'both'])
      .withMessage('Role must be creator, doer, or both'),
    body('avatar_url')
      .optional()
      .isURL()
      .withMessage('Avatar must be a valid URL'),
    body('latitude')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('Invalid latitude'),
    body('longitude')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Invalid longitude'),
  ],
  validate,
  userController.updateMe
);

/**
 * POST /api/users/onboarding
 */
router.post(
  '/onboarding',
  [
    body('name')
      .notEmpty()
      .isString()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name is required (2-100 characters)'),
    body('role')
      .notEmpty()
      .isIn(['creator', 'doer', 'both'])
      .withMessage('Role must be creator, doer, or both'),
    body('avatar_url')
      .optional()
      .isURL()
      .withMessage('Avatar must be a valid URL'),
    body('latitude')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('Invalid latitude'),
    body('longitude')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Invalid longitude'),
  ],
  validate,
  userController.completeOnboarding
);

/**
 * GET /api/users/:id
 */
router.get(
  '/:id',
  [
    param('id')
      .isUUID()
      .withMessage('Invalid user ID'),
  ],
  validate,
  userController.getUserProfile
);

module.exports = router;
