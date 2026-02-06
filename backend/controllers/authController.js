const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { getFirebaseAuth } = require('../config/firebase');
const ApiError = require('../utils/ApiError');
const { success } = require('../utils/apiResponse');

/**
 * Generate access and refresh tokens
 */
function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });

  return { accessToken, refreshToken };
}

/**
 * POST /api/auth/send-otp
 * In production: triggers Firebase Phone Auth on the client side
 * This endpoint is a placeholder that confirms the phone number format
 */
async function sendOtp(req, res, next) {
  try {
    const { phone } = req.body;

    // Validate phone format (Indian mobile: +91XXXXXXXXXX)
    if (!phone || !/^\+\d{10,15}$/.test(phone)) {
      throw ApiError.badRequest('Invalid phone number. Use format: +91XXXXXXXXXX');
    }

    // In production, OTP is sent via Firebase client SDK
    // The backend just validates and responds
    return success(res, { phone }, 'OTP flow initiated. Verify on client using Firebase.');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/verify-otp
 * Verifies Firebase ID token and creates/returns user + JWT
 */
async function verifyOtp(req, res, next) {
  try {
    const { idToken, phone } = req.body;

    if (!phone || !/^\+\d{10,15}$/.test(phone)) {
      throw ApiError.badRequest('Invalid phone number');
    }

    let firebaseUid = null;
    const firebaseAuth = getFirebaseAuth();

    if (firebaseAuth && idToken) {
      // Production: verify Firebase ID token
      try {
        const decodedToken = await firebaseAuth.verifyIdToken(idToken);
        firebaseUid = decodedToken.uid;

        // Verify the phone number matches
        if (decodedToken.phone_number && decodedToken.phone_number !== phone) {
          throw ApiError.badRequest('Phone number mismatch');
        }
      } catch (err) {
        if (err instanceof ApiError) throw err;
        throw ApiError.unauthorized('Invalid Firebase ID token');
      }
    } else {
      // Development/mock mode: accept without Firebase verification
      console.warn('⚠️  Firebase not configured — using mock OTP verification');
      firebaseUid = `mock_${phone.replace(/\+/g, '')}`;
    }

    // Find or create user
    let user = await User.findOne({ where: { phone } });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await User.create({
        phone,
        firebase_uid: firebaseUid,
        verified: true,
      });
    } else {
      // Update firebase_uid if not set
      if (!user.firebase_uid && firebaseUid) {
        user.firebase_uid = firebaseUid;
        await user.save();
      }
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Store refresh token
    user.refresh_token = refreshToken;
    user.last_seen = new Date();
    await user.save();

    return success(res, {
      user: user.toProfileJSON(),
      accessToken,
      refreshToken,
      isNewUser,
    }, isNewUser ? 'Account created successfully' : 'Login successful');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/refresh-token
 * Refresh the access token using a valid refresh token
 */
async function refreshToken(req, res, next) {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw ApiError.badRequest('Refresh token is required');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (user.refresh_token !== token) {
      throw ApiError.unauthorized('Refresh token has been revoked');
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);

    // Update stored refresh token
    user.refresh_token = tokens.refreshToken;
    user.last_seen = new Date();
    await user.save();

    return success(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendOtp,
  verifyOtp,
  refreshToken,
};
