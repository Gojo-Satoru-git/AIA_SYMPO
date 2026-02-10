import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if(!admin.apps.length){
  try {
    const keyPath = path.resolve(__dirname, "../../serviceAccountKey.json");

    if(fs.existsSync(keyPath)){
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });

      console.log("Firebase initialized successfully");
    } else {
      console.log("Service account not found, using Dedault Credentials (Cloud)");
      admin.initializeApp();
    }
  } catch (error) {
    console.error("Failed to initialize Firebase: ", error.message);
    if (process.env.NODE_ENV === 'development') process.exit(1);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();

export default admin;