const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      type: {
        type: DataTypes.ENUM(
          'task_new',
          'task_application',
          'task_accepted',
          'task_rejected',
          'task_completed',
          'task_confirmed',
          'task_cancelled',
          'chat_message',
          'review_received',
          'payment_received',
          'payment_sent',
          'wallet_credit',
          'system'
        ),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      data_json: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: 'notifications',
      timestamps: true,
      underscored: true,
      updatedAt: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['read'] },
        { fields: ['type'] },
        { fields: ['created_at'] },
        { fields: ['user_id', 'read'] },
      ],
    }
  );

  return Notification;
};
