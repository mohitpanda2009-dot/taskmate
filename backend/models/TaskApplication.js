const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TaskApplication = sequelize.define(
    'TaskApplication',
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
      doer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      proposed_budget: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      tableName: 'task_applications',
      timestamps: true,
      underscored: true,
      updatedAt: false,
      indexes: [
        { fields: ['task_id'] },
        { fields: ['doer_id'] },
        { fields: ['status'] },
        {
          fields: ['task_id', 'doer_id'],
          unique: true,
          name: 'unique_task_doer_application',
        },
      ],
    }
  );

  return TaskApplication;
};
