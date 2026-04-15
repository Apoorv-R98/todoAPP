import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { getTodos, saveTodos } from "./todo-store.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json());
app.use(express.static(join(__dirname, "../public")));

app.get("/api/todos", async (_req, res) => {
  try {
    const todos = await getTodos();
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load todos" });
  }
});

app.post("/api/todos", async (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) {
    res.status(400).json({ error: "text is required" });
    return;
  }
  try {
    const todos = await getTodos();
    const todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    todos.unshift(todo);
    await saveTodos(todos);
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

app.patch("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body ?? {};
  try {
    const todos = await getTodos();
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    if (typeof text === "string") {
      const trimmed = text.trim();
      if (!trimmed) {
        res.status(400).json({ error: "text cannot be empty" });
        return;
      }
      todos[idx].text = trimmed;
    }
    if (typeof completed === "boolean") {
      todos[idx].completed = completed;
    }
    await saveTodos(todos);
    res.json(todos[idx]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todos = await getTodos();
    const next = todos.filter((t) => t.id !== id);
    if (next.length === todos.length) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    await saveTodos(next);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.listen(PORT, () => {
  console.log(`Todo app: http://localhost:${PORT}`);
});
