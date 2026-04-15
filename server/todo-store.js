import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = new URL("../data/todos.json", import.meta.url);

async function ensureDataFile() {
  try {
    await readFile(DATA_PATH, "utf8");
  } catch {
    await mkdir(dirname(fileURLToPath(DATA_PATH)), { recursive: true });
    await writeFile(DATA_PATH, "[]", "utf8");
  }
}

/**
 * @returns {Promise<Array<{ id: string, text: string, completed: boolean, createdAt: string }>>}
 */
export async function getTodos() {
  await ensureDataFile();
  const raw = await readFile(DATA_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * @param {Array<{ id: string, text: string, completed: boolean, createdAt: string }>} todos
 */
export async function saveTodos(todos) {
  await ensureDataFile();
  await writeFile(DATA_PATH, JSON.stringify(todos, null, 2), "utf8");
}
