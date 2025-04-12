const { Reservation, InventoryListing, Product } = require('../models');
const { Op } = require('sequelize');
const LockManager = require('../utils/lockManager');
require('dotenv').config();

const RESERVATION_EXPIRY_MINUTES = parseInt(process.env.RESERVATION_EXPIRY_MINUTES) || 5;

class ReservationService {
  async createReservation(buyerId, listingId, quantity) {
    const transaction = await Reservation.sequelize.transaction();
    
    try {
      // Find the listing and lock it
      const listing = await InventoryListing.findByPk(listingId, {
        lock: transaction.LOCK.UPDATE,
        transaction
      });

      if (!listing) {
        throw new Error('Listing not found');
      }

      // Check if listing is expired
      if (listing.expiry_time <= new Date()) {
        throw new Error('Listing has expired');
      }

      // Check available quantity
      if (listing.available_quantity < quantity) {
        throw new Error(`Not enough quantity available. Requested: ${quantity}, Available: ${listing.available_quantity}`);
      }

      // Calculate expiration time (5 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      // Create reservation
      const reservation = await Reservation.create({
        listing_id: listingId,
        buyer_id: buyerId,
        quantity: quantity,
        status: 'PENDING',
        expires_at: expiresAt
      }, { transaction });

      // Update available quantity
      await listing.update({
        available_quantity: listing.available_quantity - quantity
      }, { transaction });

      await transaction.commit();
      return reservation;

    } catch (error) {
      await transaction.rollback();
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  async confirmReservation(reservationId) {
    const transaction = await Reservation.sequelize.transaction();
    
    try {
      // First, get the reservation with a lock
      const reservation = await Reservation.findByPk(reservationId, {
        lock: true,
        transaction
      });

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      if (reservation.status !== 'PENDING') {
        throw new Error(`Cannot confirm reservation with status: ${reservation.status}`);
      }

      if (reservation.expires_at <= new Date()) {
        throw new Error('Reservation has expired');
      }

      // Get the inventory listing separately
      const listing = await InventoryListing.findByPk(reservation.listing_id, {
        lock: true,
        transaction
      });

      if (!listing) {
        throw new Error('Associated inventory listing not found');
      }

      // Update reservation status
      await reservation.update(
        { status: 'CONFIRMED' },
        { transaction }
      );

      // Update the listing's quantity (reduce the total quantity)
      await listing.update(
        { 
          quantity: listing.quantity - reservation.quantity
          // Note: we don't update available_quantity here since it was already reduced when creating the reservation
        },
        { transaction }
      );

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      console.error('Error confirming reservation:', error);
      throw error;
    }
  }

  async expireReservation(reservationId) {
    const lockKey = `reservation_${reservationId}`;
    
    try {
      await LockManager.acquire(lockKey);
      
      const reservation = await Reservation.findByPk(reservationId);
      if (!reservation || reservation.status !== 'PENDING') {
        return false;
      }

      const transaction = await Reservation.sequelize.transaction();
      
      try {
        // Update reservation status
        await Reservation.update({
          status: 'EXPIRED'
        }, {
          where: { id: reservationId },
          transaction
        });

        // Return the reserved quantity back to available
        await InventoryListing.increment('available_quantity', {
          by: reservation.quantity,
          where: { id: reservation.listing_id },
          transaction
        });

        await transaction.commit();
        return true;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } finally {
      await LockManager.release(lockKey);
    }
  }

  async processExpiredReservations() {
    const now = new Date();
    const expiredReservations = await Reservation.findAll({
      where: {
        status: 'PENDING',
        expires_at: { [Op.lte]: now }
      }
    });

    for (const reservation of expiredReservations) {
      try {
        await this.expireReservation(reservation.id);
      } catch (error) {
        console.error(`Failed to expire reservation ${reservation.id}:`, error);
      }
    }
  }

  async getReservations(where = {}) {
    try {
      const reservations = await Reservation.findAll({
        where,
        include: [{
          model: InventoryListing,
          as: 'inventoryListing',
          include: [{
            model: Product,
            as: 'product'
          }]
        }],
        order: [['created_at', 'DESC']]
      });

      // Transform the data to include product details
      return reservations.map(reservation => {
        const plainReservation = reservation.get({ plain: true });
        return {
          id: plainReservation.id,
          buyer_id: plainReservation.buyer_id,
          quantity: plainReservation.quantity,
          status: plainReservation.status,
          expires_at: plainReservation.expires_at,
          created_at: plainReservation.created_at,
          product: plainReservation.inventoryListing?.product || null,
          listing: {
            id: plainReservation.inventoryListing?.id,
            price: plainReservation.inventoryListing?.price,
            available_quantity: plainReservation.inventoryListing?.available_quantity,
            total_quantity: plainReservation.inventoryListing?.quantity
          }
        };
      });
    } catch (error) {
      console.error('Error getting reservations:', error);
      throw error;
    }
  }

  async getReservationById(id) {
    try {
      const reservation = await Reservation.findByPk(id, {
        include: [{
          model: InventoryListing,
          as: 'inventoryListing',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });

      if (!reservation) {
        return null;
      }

      const plainReservation = reservation.get({ plain: true });
      return {
        id: plainReservation.id,
        buyer_id: plainReservation.buyer_id,
        quantity: plainReservation.quantity,
        status: plainReservation.status,
        expires_at: plainReservation.expires_at,
        created_at: plainReservation.created_at,
        product: plainReservation.inventoryListing?.product || null,
        listing: {
          id: plainReservation.inventoryListing?.id,
          price: plainReservation.inventoryListing?.price,
          available_quantity: plainReservation.inventoryListing?.available_quantity,
          total_quantity: plainReservation.inventoryListing?.quantity
        }
      };
    } catch (error) {
      console.error('Error getting reservation by id:', error);
      throw error;
    }
  }

  // Optional: Add method to get reservations by status
  async getReservationsByStatus(status) {
    try {
      return await Reservation.findAll({
        where: { status },
        include: [{
          model: InventoryListing,
          as: 'inventoryListing',
          include: [{
            model: Product,
            as: 'product'
          }]
        }],
        order: [['created_at', 'DESC']]
      });
    } catch (error) {
      console.error('Error getting reservations by status:', error);
      throw error;
    }
  }

  // Optional: Add method to get reservations by buyer
  async getReservationsByBuyer(buyerId) {
    try {
      return await Reservation.findAll({
        where: { buyer_id: buyerId },
        include: [{
          model: InventoryListing,
          as: 'inventoryListing',
          include: [{
            model: Product,
            as: 'product'
          }]
        }],
        order: [['created_at', 'DESC']]
      });
    } catch (error) {
      console.error('Error getting reservations by buyer:', error);
      throw error;
    }
  }
}

module.exports = new ReservationService();