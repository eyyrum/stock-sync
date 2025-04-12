const { DataTypes } = require('sequelize');
const sequelize = require('../../db/connection');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  listing_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'inventory_listings',
      key: 'id'
    }
  },
  buyer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'PENDING',
    validate: {
      isIn: [['PENDING', 'CONFIRMED', 'EXPIRED', 'CANCELLED']]
    }
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'reservations'
});

module.exports = Reservation;