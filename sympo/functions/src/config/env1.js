import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../.env');
console.log("[Config] Loading from:", envPath);

dotenv.config({ path: envPath });

// Log what was loaded
console.log("[Config] Environment variables loaded:");

const requiredEnvVars = {
  PORT: "Application port",
  CASHFREE_APP_ID: "Cashfree App ID",
  CASHFREE_SECRET_KEY: "Cashfree Secret Key",
  CASHFREE_WEBHOOK_SECRET: "Cashfree Webhook Secret",
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
export const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
export const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Optional: Keep the object export for files that use "import env from..."
export const env = {
  PORT,
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY,
  FRONTEND_URL,
  NODE_ENV
};

export default env;
