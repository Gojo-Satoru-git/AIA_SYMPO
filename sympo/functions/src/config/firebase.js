import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if(!admin.apps.length){
  try {
    const keyPath = path.resolve(__dirname, "../../serviceAccountKey.json");
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if(fs.existsSync(keyPath)){
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId,
        databaseURL: "https://aia-symposium-2026-default-rtdb.firebaseio.com"
      });

      console.log("[Firebase] Initialized with service account key");
    } else if(process.env.GOOGLE_APPLICATION_CREDENTIALS){
      admin.initializeApp({
        projectId: projectId
      });
      console.log("[Firebase] Initialized with GOOGLE_APPLICATION_CREDENTIALS");
    } else {
      // Fallback: Specify project ID explicitly
      admin.initializeApp({
        projectId: projectId || "aia-symposium-2026"
      });
      console.log(`[Firebase] Initialized with project ID: ${projectId}`);
    }
  } catch (error) {
    console.error("[Firebase] Initialization Error:", error.message);
    console.error("[Firebase] To fix:");
    console.error("  1. Add serviceAccountKey.json to functions/ folder");
    console.error("  2. OR set GOOGLE_APPLICATION_CREDENTIALS environment variable");
    console.error("  3. OR ensure FIREBASE_PROJECT_ID is in .env file");
    if (process.env.NODE_ENV === 'development') process.exit(1);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();

export default admin;