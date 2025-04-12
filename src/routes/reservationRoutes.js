const express = require('express');
const router = express.Router();
const ReservationService = require('../services/reservationService');
const { User } = require('../models');

// Create a new reservation
router.post('/', async (req, res) => {
  try {
    const { buyerId, listingId, quantity } = req.body;
    
    // Verify buyer exists
    const buyer = await User.findByPk(buyerId);
    if (!buyer) {
      return res.status(400).json({ error: 'Invalid buyer ID' });
    }
    if (buyer.role !== 'buyer') {
      return res.status(400).json({ error: 'User must be a buyer to make reservations' });
    }

    const reservation = await ReservationService.createReservation(buyerId, listingId, quantity);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all reservations
router.get('/', async (req, res) => {
  try {
    const { buyerId } = req.query;
    const where = {};
    
    if (buyerId) {
      where.buyer_id = buyerId;
    }
    
    const reservations = await ReservationService.getReservations(where);
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reservation by ID
router.get('/:id', async (req, res) => {
  try {
    const reservation = await ReservationService.getReservationById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm reservation
router.post('/:id/confirm', async (req, res) => {
  try {
    const success = await ReservationService.confirmReservation(req.params.id);
    if (success) {
      res.json({ message: 'Reservation confirmed successfully' });
    } else {
      res.status(400).json({ error: 'Failed to confirm reservation' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;