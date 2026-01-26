import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per window
  message: { message: "Too many requests, please try again later." },  
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.uid || ipKeyGenerator(req),
  skip: (req) => {
    // Skiping the health check api
    return req.path === '/';
  },
});

export const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Stricter limit for payments
  message: { message: "Payment limit reached, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.uid || ipKeyGenerator(req),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 5 signup attempts per 15 mins
  message: { message: "Too many auth attempts, please try again later." },
  skipSuccessfulRequests: true, // Only count failed attempts
});