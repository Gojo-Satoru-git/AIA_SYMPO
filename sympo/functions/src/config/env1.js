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

// Define and export each variable individually (Named Exports)
export const PORT = parseInt(process.env.PORT, 10) || 5000;
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Optional: Keep the object export for files that use "import env from..."
export const env = {
  PORT,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  FRONTEND_URL,
  NODE_ENV
};

export default env;
