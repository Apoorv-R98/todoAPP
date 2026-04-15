import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.static(join(__dirname, "../public")));

app.listen(PORT, () => {
  console.log(`Todo app: http://localhost:${PORT}`);
});
