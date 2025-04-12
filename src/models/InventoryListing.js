const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventoryListing = sequelize.define('InventoryListing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  available_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  expiry_time: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'inventory_listings',
  underscored: true
});

// Define the association (add this outside the define block)
InventoryListing.associate = function(models) {
  InventoryListing.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });
};

module.exports = InventoryListing;