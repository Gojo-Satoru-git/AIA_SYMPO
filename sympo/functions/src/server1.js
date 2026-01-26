import './config/env1.js';
import app from "./app.js";
import { PORT } from "./config/env1.js";

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);