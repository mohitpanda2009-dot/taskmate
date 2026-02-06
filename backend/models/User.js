const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.ENUM('creator', 'doer', 'both'),
        allowNull: true,
        defaultValue: null,
      },
      avatar_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          min: 0,
          max: 5,
        },
      },
      total_reviews: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      wallet_balance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      onboarding_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      firebase_uid: {
        type: DataTypes.STRING(128),
        allowNull: true,
        unique: true,
      },
      refresh_token: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      last_seen: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_online: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['phone'], unique: true },
        { fields: ['email'], unique: true },
        { fields: ['firebase_uid'], unique: true },
        { fields: ['latitude', 'longitude'] },
        { fields: ['role'] },
      ],
    }
  );

  User.prototype.toPublicJSON = function () {
    return {
      id: this.id,
      name: this.name,
      avatar_url: this.avatar_url,
      role: this.role,
      rating: parseFloat(this.rating),
      total_reviews: this.total_reviews,
      verified: this.verified,
      is_online: this.is_online,
      created_at: this.created_at,
    };
  };

  User.prototype.toProfileJSON = function () {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      email: this.email,
      role: this.role,
      avatar_url: this.avatar_url,
      rating: parseFloat(this.rating),
      total_reviews: this.total_reviews,
      wallet_balance: parseFloat(this.wallet_balance),
      latitude: this.latitude ? parseFloat(this.latitude) : null,
      longitude: this.longitude ? parseFloat(this.longitude) : null,
      verified: this.verified,
      onboarding_completed: this.onboarding_completed,
      is_online: this.is_online,
      last_seen: this.last_seen,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  };

  return User;
};
