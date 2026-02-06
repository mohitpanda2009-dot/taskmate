const ApiError = require('../utils/ApiError');

/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, _next) {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  } else {
    // In production, log only non-operational errors
    if (!err.isOperational) {
      console.error('❌ Unexpected Error:', err);
    }
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: `${e.path} already exists`,
    }));
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
      errors,
    });
  }

  // Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Referenced resource not found',
    });
  }

  // JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
    });
  }

  // Custom ApiError
  if (err instanceof ApiError) {
    const response = {
      success: false,
      message: err.message,
    };
    if (err.errors && err.errors.length > 0) {
      response.errors = err.errors;
    }
    return res.status(err.statusCode).json(response);
  }

  // Default server error
  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
}

module.exports = errorHandler;
