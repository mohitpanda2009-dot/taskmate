const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Chat = sequelize.define(
    'Chat',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      task_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'tasks', key: 'id' },
      },
      creator_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      doer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      last_message_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      last_message_text: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      tableName: 'chats',
      timestamps: true,
      underscored: true,
      updatedAt: false,
      indexes: [
        { fields: ['task_id'] },
        { fields: ['creator_id'] },
        { fields: ['doer_id'] },
        {
          fields: ['task_id', 'creator_id', 'doer_id'],
          unique: true,
          name: 'unique_task_chat',
        },
        { fields: ['last_message_at'] },
      ],
    }
  );

  return Chat;
};
