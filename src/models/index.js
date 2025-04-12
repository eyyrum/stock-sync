const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const InventoryListing = require('./InventoryListing');
const Reservation = require('./Reservation');

// Define associations
Product.hasMany(InventoryListing, {
  foreignKey: 'product_id',
  as: 'inventoryListings'
});

InventoryListing.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// User associations
User.hasMany(InventoryListing, {
  foreignKey: 'seller_id',
  as: 'listings'
});

User.hasMany(Reservation, {
  foreignKey: 'buyer_id',
  as: 'reservations'
});

InventoryListing.belongsTo(User, {
  foreignKey: 'seller_id',
  as: 'seller'
});

InventoryListing.hasMany(Reservation, {
  foreignKey: 'listing_id',
  as: 'reservations'
});

Reservation.belongsTo(InventoryListing, {
  foreignKey: 'listing_id',
  as: 'inventoryListing'
});

Reservation.belongsTo(User, {
  foreignKey: 'buyer_id',
  as: 'buyer'
});

// Export models
module.exports = {
  sequelize,
  User,
  Product,
  InventoryListing,
  Reservation
};
