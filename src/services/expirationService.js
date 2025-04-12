const ReservationService = require('./reservationService');

class ExpirationService {
  constructor() {
    this.interval = null;
  }

  start() {
    // Check for expired reservations every minute
    this.interval = setInterval(async () => {
      try {
        await ReservationService.processExpiredReservations();
      } catch (error) {
        console.error('Error processing expired reservations:', error);
      }
    }, 60000); // 1 minute
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

module.exports = new ExpirationService();