// Simple in-memory lock manager for concurrency control
// In a production environment, consider using Redis or similar for distributed locks

const locks = new Map();

class LockManager {
  static async acquire(key, timeout = 5000, retryInterval = 100) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (!locks.has(key)) {
        locks.set(key, true);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
    
    throw new Error(`Could not acquire lock for key ${key} within ${timeout}ms`);
  }

  static async release(key) {
    locks.delete(key);
  }
}

module.exports = LockManager;