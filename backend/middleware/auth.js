const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * JWT authentication middleware
 * Extracts token from Authorization header (Bearer <token>)
 * Attaches user to req.user
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token is required');
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Token has expired');
      }
      throw ApiError.unauthorized('Invalid token');
    }

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication — attaches user if token present, but doesn't require it
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);
        if (user) {
          req.user = user;
          req.userId = user.id;
        }
      } catch {
        // Token invalid — proceed without user
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authenticate, optionalAuth };
