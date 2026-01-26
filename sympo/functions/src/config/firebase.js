import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let serviceAccount;

try {
  const keyPath = path.resolve(__dirname, "../../serviceAccountKey.json");

  if(!fs.existsSync(keyPath)){
    throw new Error("Service account key not found");
  }

  serviceAccount = JSON.parse(
    fs.readFileSync(keyPath, "utf8")
  );
} catch (error) {
  console.error("Failed to load Firebase service account: ", error.message);
  process.exit(1);
}

if(!admin.apps.length){
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firebase: ", error.message);
    process.exit(1);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();

export default admin;