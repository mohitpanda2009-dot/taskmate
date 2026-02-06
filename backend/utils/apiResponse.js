/**
 * Standard API response helper
 */
function success(res, data = null, message = 'Success', statusCode = 200) {
  const response = {
    success: true,
    message,
  };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
}

function created(res, data = null, message = 'Created successfully') {
  return success(res, data, message, 201);
}

function paginated(res, { rows, count, page, limit }) {
  return res.status(200).json({
    success: true,
    message: 'Success',
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(count / limit),
    },
  });
}

function error(res, statusCode = 500, message = 'Error', errors = []) {
  const response = {
    success: false,
    message,
  };
  if (errors.length > 0) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
}

module.exports = { success, created, paginated, error };
