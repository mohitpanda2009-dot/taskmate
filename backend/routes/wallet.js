const { Router } = require('express');
const { body, query } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const walletController = require('../controllers/walletController');

const router = Router();

// All wallet routes require authentication
router.use(authenticate);

/**
 * GET /api/wallet/balance
 */
router.get('/balance', walletController.getBalance);

/**
 * GET /api/wallet/transactions
 */
router.get(
  '/transactions',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('type')
      .optional()
      .isIn(['credit', 'debit', 'escrow', 'release'])
      .withMessage('Invalid transaction type'),
    query('status')
      .optional()
      .isIn(['pending', 'completed', 'failed'])
      .withMessage('Invalid status'),
  ],
  validate,
  walletController.getTransactions
);

/**
 * POST /api/wallet/add-funds
 */
router.post(
  '/add-funds',
  [
    body('amount')
      .notEmpty()
      .isFloat({ min: 1, max: 100000 })
      .withMessage('Amount must be between ₹1 and ₹1,00,000'),
    body('payment_method')
      .optional()
      .isString()
      .withMessage('Payment method must be a string'),
  ],
  validate,
  walletController.addFunds
);

module.exports = router;
