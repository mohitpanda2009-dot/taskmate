require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { sequelize } = require('./models');
const { initializeFirebase } = require('./config/firebase');
const { initializeSocket } = require('./config/socket');

const PORT = parseInt(process.env.PORT, 10) || 3000;

// ── Create HTTP Server ──
const server = http.createServer(app);

// ── Initialize Socket.io ──
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Make io available to Express routes via req.app.get('io')
app.set('io', io);

// Initialize Socket.io handlers
initializeSocket(io);

// ── Boot Sequence ──
async function start() {
  try {
    // 1. Initialize Firebase
    initializeFirebase();

    // 2. Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // 3. Sync models (create tables if they don't exist)
    // In production, use migrations instead of sync
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synced');
    }

    // 4. Start server
    server.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════╗
║         🚀 TASKMATE API SERVER        ║
╠═══════════════════════════════════════╣
║  Port:        ${String(PORT).padEnd(22)}║
║  Environment: ${String(process.env.NODE_ENV || 'development').padEnd(22)}║
║  API Prefix:  ${String(process.env.API_PREFIX || '/api').padEnd(22)}║
║  Socket.io:   Enabled                ║
╚═══════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// ── Graceful Shutdown ──
function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log('HTTP server closed');

    try {
      await sequelize.close();
      console.log('Database connection closed');
    } catch (err) {
      console.error('Error closing database:', err);
    }

    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    console.error('Force shutting down...');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

start();
