const { User, Transaction } = require('../models');
const ApiError = require('../utils/ApiError');
const { success, paginated } = require('../utils/apiResponse');
const { parsePagination } = require('../utils/helpers');
const { v4: uuidv4 } = require('uuid');

/**
 * GET /api/wallet/balance
 * Get current wallet balance
 */
async function getBalance(req, res, next) {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'wallet_balance'],
    });

    if (!user) throw ApiError.notFound('User not found');

    // Also get pending escrow amounts
    const pendingEscrow = await Transaction.sum('amount', {
      where: {
        user_id: req.userId,
        type: 'escrow',
        status: 'completed',
      },
    });

    const releasedEscrow = await Transaction.sum('amount', {
      where: {
        user_id: req.userId,
        type: 'release',
        status: 'completed',
      },
    });

    const escrowHeld = (pendingEscrow || 0) - (releasedEscrow || 0);

    return success(res, {
      balance: parseFloat(user.wallet_balance),
      escrow_held: Math.max(0, escrowHeld),
      available: parseFloat(user.wallet_balance),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/wallet/transactions
 * Transaction history
 */
async function getTransactions(req, res, next) {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { type, status } = req.query;

    const where = { user_id: req.userId };
    if (type) where.type = type;
    if (status) where.status = status;

    const { rows, count } = await Transaction.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return paginated(res, { rows, count, page, limit });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/wallet/add-funds
 * Add funds to wallet (placeholder for payment gateway integration)
 */
async function addFunds(req, res, next) {
  try {
    const { amount, payment_method } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      throw ApiError.badRequest('Amount must be greater than 0');
    }

    const parsedAmount = parseFloat(amount);

    if (parsedAmount > 100000) {
      throw ApiError.badRequest('Maximum single transaction limit is ₹1,00,000');
    }

    // In production, this would:
    // 1. Create a payment order with Razorpay/Cashfree
    // 2. Return the order ID for client-side payment
    // 3. Verify payment via webhook callback
    // 4. Then credit the wallet

    // For now, directly credit the wallet (simulating successful payment)
    const { sequelize } = require('../models');

    const transaction = await sequelize.transaction(async (t) => {
      // Create transaction record
      const txn = await Transaction.create(
        {
          user_id: req.userId,
          type: 'credit',
          amount: parsedAmount,
          status: 'completed',
          description: `Wallet top-up via ${payment_method || 'UPI'}`,
          reference_id: `PAY_${uuidv4().substring(0, 12).toUpperCase()}`,
        },
        { transaction: t }
      );

      // Credit wallet
      await User.update(
        {
          wallet_balance: sequelize.literal(
            `wallet_balance + ${parsedAmount}`
          ),
        },
        { where: { id: req.userId }, transaction: t }
      );

      return txn;
    });

    // Get updated balance
    const user = await User.findByPk(req.userId, {
      attributes: ['wallet_balance'],
    });

    return success(
      res,
      {
        transaction,
        new_balance: parseFloat(user.wallet_balance),
      },
      `₹${parsedAmount} added to wallet`
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBalance,
  getTransactions,
  addFunds,
};
