import rateLimit from 'express-rate-limit';

const GLOBAL_WINDOW_MS = 60 * 1000;
const GLOBAL_MAX = 200;

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX = 10;

export const globalLimiter = rateLimit({
  windowMs: GLOBAL_WINDOW_MS,
  max: GLOBAL_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 429,
    message: 'Too many requests, please try again later.',
  },
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded) {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
});

export const loginLimiter = rateLimit({
  windowMs: LOGIN_WINDOW_MS,
  max: LOGIN_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 429,
    message: 'Too many login attempts, please try again in 15 minutes.',
  },
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded) {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
});
