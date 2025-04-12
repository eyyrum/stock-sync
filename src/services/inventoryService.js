const { InventoryListing, Product } = require('../models');
const { Op } = require('sequelize');

class InventoryService {
  async createListing(sellerId, productData, listingData) {
    const transaction = await InventoryListing.sequelize.transaction();
    
    try {
      // Find or create product
      const [product] = await Product.findOrCreate({
        where: { sku: productData.sku },
        defaults: productData,
        transaction
      });

      // Create inventory listing
      const listing = await InventoryListing.create({
        product_id: product.id,
        seller_id: sellerId,
        quantity: listingData.quantity,
        available_quantity: listingData.quantity,
        price: listingData.price,
        expiry_time: listingData.expiry_time
      }, { transaction });

      await transaction.commit();
      return listing;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getAvailableListings() {
    try {
      const now = new Date();
      console.log('Querying available listings...');
      
      const listings = await InventoryListing.findAll({
        where: {
          available_quantity: { [Op.gt]: 0 },
          expiry_time: { [Op.gt]: now }
        },
        include: [{
          model: Product,
          as: 'product',
          required: true
        }]
      });
      
      console.log(`Found ${listings.length} available listings`);
      return listings;
    } catch (error) {
      console.error('Error in getAvailableListings:', error);
      throw error;
    }
  }

  async getListingById(id) {
    return InventoryListing.findByPk(id, {
      include: [Product]
    });
  }

  async getListings(where = {}) {
    try {
      const listings = await InventoryListing.findAll({
        where,
        include: [{
          model: Product,
          as: 'product'
        }],
        order: [['created_at', 'DESC']]
      });

      return listings.map(listing => {
        const plainListing = listing.get({ plain: true });
        return {
          id: plainListing.id,
          seller_id: plainListing.seller_id,
          quantity: plainListing.quantity,
          available_quantity: plainListing.available_quantity,
          price: plainListing.price,
          expiry_time: plainListing.expiry_time,
          created_at: plainListing.created_at,
          product: plainListing.product || null
        };
      });
    } catch (error) {
      console.error('Error getting listings:', error);
      throw error;
    }
  }
}

module.exports = new InventoryService();