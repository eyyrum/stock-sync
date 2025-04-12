const express = require('express');
const router = express.Router();
const InventoryService = require('../services/inventoryService');
const { Op } = require('sequelize');

// Get all inventory listings
router.get('/', async (req, res) => {
  try {
    const { sellerId } = req.query;
    const where = {};
    
    if (sellerId) {
      where.seller_id = sellerId;
    }
    
    const listings = await InventoryService.getListings(where);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new listing
router.post('/', async (req, res) => {
  try {
    const { sellerId, product, listing } = req.body;
    const newListing = await InventoryService.createListing(sellerId, product, listing);
    res.status(201).json(newListing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get specific listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await InventoryService.getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;