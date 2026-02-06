const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Initialize Socket.io with JWT authentication and event handlers
 */
function initializeSocket(io) {
  // ── Authentication Middleware ──
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  // ── Connection Handler ──
  io.on('connection', async (socket) => {
    const userId = socket.userId;
    console.log(`🔌 User connected: ${userId}`);

    // Join personal room for direct notifications
    socket.join(`user:${userId}`);

    // Update online status
    await User.update(
      { is_online: true, last_seen: new Date() },
      { where: { id: userId } }
    );

    // Broadcast online status to relevant users
    socket.broadcast.emit('user:online', { userId });

    // ── Join Chat Room ──
    socket.on('chat:join', (data) => {
      const { chatId } = data;
      if (chatId) {
        socket.join(`chat:${chatId}`);
        console.log(`💬 User ${userId} joined chat:${chatId}`);
      }
    });

    // ── Leave Chat Room ──
    socket.on('chat:leave', (data) => {
      const { chatId } = data;
      if (chatId) {
        socket.leave(`chat:${chatId}`);
        console.log(`💬 User ${userId} left chat:${chatId}`);
      }
    });

    // ── Typing Indicators ──
    socket.on('chat:typing', (data) => {
      const { chatId } = data;
      if (chatId) {
        socket.to(`chat:${chatId}`).emit('chat:typing', {
          chatId,
          userId,
          userName: socket.user.name,
        });
      }
    });

    socket.on('chat:stopTyping', (data) => {
      const { chatId } = data;
      if (chatId) {
        socket.to(`chat:${chatId}`).emit('chat:stopTyping', {
          chatId,
          userId,
        });
      }
    });

    // ── Message Read Receipt ──
    socket.on('message:read', (data) => {
      const { chatId, messageId } = data;
      if (chatId) {
        socket.to(`chat:${chatId}`).emit('message:read', {
          chatId,
          messageId,
          readBy: userId,
        });
      }
    });

    // ── Task Room (for live updates) ──
    socket.on('task:watch', (data) => {
      const { taskId } = data;
      if (taskId) {
        socket.join(`task:${taskId}`);
      }
    });

    socket.on('task:unwatch', (data) => {
      const { taskId } = data;
      if (taskId) {
        socket.leave(`task:${taskId}`);
      }
    });

    // ── Disconnect ──
    socket.on('disconnect', async () => {
      console.log(`🔌 User disconnected: ${userId}`);

      // Update online status
      await User.update(
        { is_online: false, last_seen: new Date() },
        { where: { id: userId } }
      );

      // Broadcast offline status
      socket.broadcast.emit('user:offline', { userId });
    });

    // ── Error Handling ──
    socket.on('error', (err) => {
      console.error(`Socket error for user ${userId}:`, err.message);
    });
  });

  console.log('✅ Socket.io initialized');
  return io;
}

module.exports = { initializeSocket };
