import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import {PORT} from "./config/env1.js"; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import app from "./app.js";


app.listen(PORT, () =>
  console.log(`server running on port ${PORT}`),
);
