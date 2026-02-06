const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define(
    'Transaction',
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
      task_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'tasks', key: 'id' },
      },
      type: {
        type: DataTypes.ENUM('credit', 'debit', 'escrow', 'release'),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      reference_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: 'transactions',
      timestamps: true,
      underscored: true,
      updatedAt: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['task_id'] },
        { fields: ['type'] },
        { fields: ['status'] },
        { fields: ['created_at'] },
      ],
    }
  );

  return Transaction;
};
