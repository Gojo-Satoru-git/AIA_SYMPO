import express from "express";
import cors from "cors";
import helmet from "helmet";

import "./config/env.js";
import { globalLimiter, authLimiter } from "./middlewares/rateLimit.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Body parsing
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Rate limiting
app.use(globalLimiter);

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
}));

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend OK" });
});

// Routes with specific limiters
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/user", globalLimiter, userRoutes);
app.use("/api/payment", paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

export default app;
