const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define(
    'Message',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      chat_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'chats', key: 'id' },
      },
      sender_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      media_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      media_type: {
        type: DataTypes.ENUM('image', 'video', 'file', 'location'),
        allowNull: true,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'messages',
      timestamps: true,
      underscored: true,
      updatedAt: false,
      indexes: [
        { fields: ['chat_id'] },
        { fields: ['sender_id'] },
        { fields: ['created_at'] },
        { fields: ['chat_id', 'created_at'] },
      ],
    }
  );

  return Message;
};
