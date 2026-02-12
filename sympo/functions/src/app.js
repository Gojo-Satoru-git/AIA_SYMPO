import express from "express";
import cors from "cors";
import helmet from "helmet";

import { globalLimiter, authLimiter } from "./middlewares/rateLimit.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";
import collegeRoutes from './routes/college.routes.js';
import otpRoutes from './routes/otp.routes.js';
import promoRoutes from "./routes/promo.routes.js";

import { FRONTEND_URL  } from "./config/env1.js"; 

const app = express();

app.use(helmet());

console.log(FRONTEND_URL());

app.use(cors({
  origin: FRONTEND_URL() || "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


app.use("/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));
app.use(globalLimiter);



app.get("/", (req, res) => res.status(200).json({ status: "Backend OK" }));

// Routes
app.use("/auth", authLimiter, authRoutes);
app.use("/payment", paymentRoutes);
app.use("/user", userRoutes);
app.use("/events", eventRoutes);
app.use("/colleges", collegeRoutes);
app.use("/otp", otpRoutes);
app.use("/promo", promoRoutes);

// 404 Handler & Error Middleware
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);

export default app;
