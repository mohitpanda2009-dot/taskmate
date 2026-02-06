const { Notification } = require('../models');

/**
 * Create a notification and optionally emit it via socket
 */
async function createNotification({ userId, type, title, body, data = null, io = null }) {
  const notification = await Notification.create({
    user_id: userId,
    type,
    title,
    body,
    data_json: data,
  });

  // Emit real-time notification if socket.io instance provided
  if (io) {
    io.to(`user:${userId}`).emit('notification', {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data_json: notification.data_json,
      read: notification.read,
      created_at: notification.created_at,
    });
  }

  return notification;
}

module.exports = { createNotification };
