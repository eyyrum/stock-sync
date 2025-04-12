const { DataTypes } = require('sequelize');
const sequelize = require('../../db/connection');

const Product = sequelize.define('Product', {
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'products'
});

Product.associate = function(models) {
    Product.hasMany(models.InventoryListing, {
      foreignKey: 'product_id',
      as: 'inventoryListings'
    });
  };

module.exports = Product;