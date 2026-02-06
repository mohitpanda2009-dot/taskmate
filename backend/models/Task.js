const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define(
    'Task',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      creator_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      doer_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          len: [3, 200],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [10, 5000],
        },
      },
      category: {
        type: DataTypes.ENUM(
          'form_filling',
          'delivery',
          'standing_in_line',
          'shopping',
          'document_work',
          'small_repairs',
          'driving',
          'photo_video',
          'other'
        ),
        allowNull: false,
      },
      budget: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      status: {
        type: DataTypes.ENUM(
          'open',
          'assigned',
          'in_progress',
          'completed',
          'cancelled'
        ),
        allowNull: false,
        defaultValue: 'open',
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING(500)),
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      tableName: 'tasks',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['creator_id'] },
        { fields: ['doer_id'] },
        { fields: ['status'] },
        { fields: ['category'] },
        { fields: ['latitude', 'longitude'] },
        { fields: ['created_at'] },
        { fields: ['budget'] },
      ],
    }
  );

  return Task;
};
