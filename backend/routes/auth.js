const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authController = require('../controllers/authController');

const router = Router();

/**
 * POST /api/auth/send-otp
 */
router.post(
  '/send-otp',
  [
    body('phone')
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^\+\d{10,15}$/)
      .withMessage('Phone must be in format +91XXXXXXXXXX'),
  ],
  validate,
  authController.sendOtp
);

/**
 * POST /api/auth/verify-otp
 */
router.post(
  '/verify-otp',
  [
    body('phone')
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^\+\d{10,15}$/)
      .withMessage('Invalid phone format'),
    body('idToken')
      .optional()
      .isString()
      .withMessage('idToken must be a string'),
  ],
  validate,
  authController.verifyOtp
);

/**
 * POST /api/auth/refresh-token
 */
router.post(
  '/refresh-token',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ],
  validate,
  authController.refreshToken
);

module.exports = router;
