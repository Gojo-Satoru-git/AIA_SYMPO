import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = {
  PORT: "Application port",
  RAZORPAY_KEY_ID: "Razorpay API key ID",
  RAZORPAY_KEY_SECRET: "Razorpay API key secret",
  FRONTEND_URL: "Frontend application URL",
};

const missingVars = [];

for(const [Key, description] of Object.entries(requiredEnvVars)){
  if(!process.env[Key]) {
    missingVars.push(`${Key} - ${description}`);
  }
}

if (missingVars.length > 0) {
  console.error("Missing required environment variables:");
  missingVars.forEach(v => console.error(`  - ${v}`));
  process.exit(1);
}

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'development') {
  console.warn("NODE_ENV not set. Defaulting to development.");
  process.env.NODE_ENV = 'development';
}

export default {
  PORT: parseInt(process.env.PORT, 10),
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
