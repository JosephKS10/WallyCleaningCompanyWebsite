class RateLimiter {
  constructor() {
    this.attempts = new Map();
    this.locked = new Map();
    this.MAX_ATTEMPTS = 5; // Max attempts before lock
    this.LOCK_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
    this.ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour window for attempts
  }

  // Check if an IP or email is locked
  isLocked(identifier) {
    const lockInfo = this.locked.get(identifier);
    if (lockInfo && Date.now() - lockInfo.timestamp < this.LOCK_TIME) {
      return {
        locked: true,
        remainingTime: Math.ceil((this.LOCK_TIME - (Date.now() - lockInfo.timestamp)) / 1000 / 60)
      };
    }
    
    // Clear expired lock
    if (lockInfo) {
      this.locked.delete(identifier);
      this.attempts.delete(identifier);
    }
    
    return { locked: false };
  }

  // Record an attempt
  recordAttempt(identifier) {
    const now = Date.now();
    
    // Get existing attempts
    let attemptList = this.attempts.get(identifier) || [];
    
    // Remove attempts older than the window
    attemptList = attemptList.filter(time => now - time < this.ATTEMPT_WINDOW);
    
    // Add current attempt
    attemptList.push(now);
    this.attempts.set(identifier, attemptList);
    
    // Check if should lock
    if (attemptList.length >= this.MAX_ATTEMPTS) {
      this.locked.set(identifier, { timestamp: now });
      return {
        locked: true,
        attemptsRemaining: 0
      };
    }
    
    return {
      locked: false,
      attemptsRemaining: this.MAX_ATTEMPTS - attemptList.length
    };
  }

  // Reset attempts for an identifier
  resetAttempts(identifier) {
    this.attempts.delete(identifier);
    this.locked.delete(identifier);
  }

  // Get attempt info without recording
  getAttemptInfo(identifier) {
    const lockCheck = this.isLocked(identifier);
    if (lockCheck.locked) {
      return lockCheck;
    }
    
    const attemptList = this.attempts.get(identifier) || [];
    const now = Date.now();
    const recentAttempts = attemptList.filter(time => now - time < this.ATTEMPT_WINDOW);
    
    return {
      locked: false,
      attempts: recentAttempts.length,
      attemptsRemaining: this.MAX_ATTEMPTS - recentAttempts.length
    };
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

export default rateLimiter;