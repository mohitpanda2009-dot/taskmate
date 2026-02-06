const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define(
    'Review',
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
      reviewer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      reviewee_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'reviews',
      timestamps: true,
      underscored: true,
      updatedAt: false,
      indexes: [
        { fields: ['task_id'] },
        { fields: ['reviewer_id'] },
        { fields: ['reviewee_id'] },
        {
          fields: ['task_id', 'reviewer_id'],
          unique: true,
          name: 'unique_task_reviewer',
        },
      ],
    }
  );

  return Review;
};
