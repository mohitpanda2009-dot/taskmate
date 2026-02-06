const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions || {},
  }
);

// Import models
const User = require('./User')(sequelize);
const Task = require('./Task')(sequelize);
const TaskApplication = require('./TaskApplication')(sequelize);
const Chat = require('./Chat')(sequelize);
const Message = require('./Message')(sequelize);
const Review = require('./Review')(sequelize);
const Transaction = require('./Transaction')(sequelize);
const Notification = require('./Notification')(sequelize);

// ── Associations ──

// User → Tasks (creator)
User.hasMany(Task, { foreignKey: 'creator_id', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });

// User → Tasks (assigned doer)
User.hasMany(Task, { foreignKey: 'doer_id', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'doer_id', as: 'doer' });

// Task → Applications
Task.hasMany(TaskApplication, { foreignKey: 'task_id', as: 'applications' });
TaskApplication.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

// User → Applications (doer)
User.hasMany(TaskApplication, { foreignKey: 'doer_id', as: 'applications' });
TaskApplication.belongsTo(User, { foreignKey: 'doer_id', as: 'doer' });

// Task → Chat
Task.hasMany(Chat, { foreignKey: 'task_id', as: 'chats' });
Chat.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

// User → Chats (as creator)
User.hasMany(Chat, { foreignKey: 'creator_id', as: 'creatorChats' });
Chat.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });

// User → Chats (as doer)
User.hasMany(Chat, { foreignKey: 'doer_id', as: 'doerChats' });
Chat.belongsTo(User, { foreignKey: 'doer_id', as: 'doer' });

// Chat → Messages
Chat.hasMany(Message, { foreignKey: 'chat_id', as: 'messages' });
Message.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });

// User → Messages (sender)
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// Task → Reviews
Task.hasMany(Review, { foreignKey: 'task_id', as: 'reviews' });
Review.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

// User → Reviews (as reviewer)
User.hasMany(Review, { foreignKey: 'reviewer_id', as: 'givenReviews' });
Review.belongsTo(User, { foreignKey: 'reviewer_id', as: 'reviewer' });

// User → Reviews (as reviewee)
User.hasMany(Review, { foreignKey: 'reviewee_id', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'reviewee_id', as: 'reviewee' });

// User → Transactions
User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Task → Transactions
Task.hasMany(Transaction, { foreignKey: 'task_id', as: 'transactions' });
Transaction.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

// User → Notifications
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

const db = {
  sequelize,
  Sequelize,
  User,
  Task,
  TaskApplication,
  Chat,
  Message,
  Review,
  Transaction,
  Notification,
};

module.exports = db;
