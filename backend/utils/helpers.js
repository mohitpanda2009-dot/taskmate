/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns {number} Distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Build Sequelize distance query for nearby filtering (PostgreSQL)
 */
function buildDistanceQuery(lat, lng, radiusKm = 50) {
  return `(
    6371 * acos(
      cos(radians(${parseFloat(lat)}))
      * cos(radians("latitude"))
      * cos(radians("longitude") - radians(${parseFloat(lng)}))
      + sin(radians(${parseFloat(lat)}))
      * sin(radians("latitude"))
    )
  ) <= ${parseFloat(radiusKm)}`;
}

/**
 * Build Sequelize distance select literal
 */
function distanceLiteral(lat, lng) {
  return `(
    6371 * acos(
      cos(radians(${parseFloat(lat)}))
      * cos(radians("Task"."latitude"))
      * cos(radians("Task"."longitude") - radians(${parseFloat(lng)}))
      + sin(radians(${parseFloat(lat)}))
      * sin(radians("Task"."latitude"))
    )
  )`;
}

/**
 * Parse pagination params with defaults
 */
function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

module.exports = {
  haversineDistance,
  buildDistanceQuery,
  distanceLiteral,
  parsePagination,
};
