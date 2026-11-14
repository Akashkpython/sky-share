import rateLimit from 'express-rate-limit';
import redis from '../config/redis.js';

/**
 * Global rate limiter: 100 requests per 15 minutes per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  },
});

/**
 * Upload rate limiter: 20 requests per 15 minutes per IP.
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many upload requests, please try again later.',
    },
  },
});

/**
 * Verify rate limiter: 10 requests per 15 minutes per IP (STRICT).
 */
export const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many verification attempts, please try again later.',
    },
  },
});

/**
 * Download rate limiter: 50 requests per 15 minutes per IP.
 */
export const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many download requests, please try again later.',
    },
  },
});

/**
 * Verify attempt tracker middleware.
 * Uses Redis to track failed verify attempts per IP.
 * Max 5 failed attempts per 10 minutes.
 * After 5 failures, lock out IP for 30 minutes.
 */
export async function verifyAttemptTracker(req, res, next) {
  const ip = req.ip;
  const lockoutKey = `verify_lockout:${ip}`;
  const attemptsKey = `verify_attempts:${ip}`;

  try {
    // Check if IP is locked out
    const isLockedOut = await redis.get(lockoutKey);
    if (isLockedOut) {
      const ttl = await redis.ttl(lockoutKey);
      return res.status(429).json({
        success: false,
        error: {
          code: 'VERIFY_LOCKED_OUT',
          message: `Too many failed verification attempts. Try again in ${Math.ceil(ttl / 60)} minutes.`,
          retryAfterSeconds: ttl,
        },
      });
    }

    // Store original json method to intercept the response
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      // If verification failed (not success), increment attempts
      if (body && body.success === false) {
        (async () => {
          try {
            const attempts = await redis.incr(attemptsKey);
            if (attempts === 1) {
              await redis.expire(attemptsKey, 600); // 10 minutes
            }
            if (attempts >= 5) {
              await redis.set(lockoutKey, '1', 'EX', 1800); // 30 minutes
              await redis.del(attemptsKey);
            }
            // Add remaining attempts to the response
            if (body.error) {
              body.error.remainingAttempts = Math.max(0, 5 - attempts);
            }
          } catch (err) {
            console.error('Error tracking verify attempts:', err.message);
          }
        })();
      } else {
        // Successful verification - clear attempts
        redis.del(attemptsKey).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  } catch (err) {
    console.error('Verify attempt tracker error:', err.message);
    next(); // Don't block on tracker errors
  }
}
