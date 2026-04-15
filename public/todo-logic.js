/** @typedef {{ id: string, text: string, completed: boolean, createdAt: string }} Todo */

export const STORAGE_KEY = "todoapp:todos";

/**
 * @param {string | null} raw
 * @returns {Todo[]}
 */
export function parseStoredTodos(raw) {
  if (raw == null || raw === "") return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTodoShape);
  } catch {
    return [];
  }
}

/**
 * @param {unknown} value
 * @returns {value is Todo}
 */
function isValidTodoShape(value) {
  if (value == null || typeof value !== "object") return false;
  const o = /** @type {Record<string, unknown>} */ (value);
  return (
    typeof o.id === "string" &&
    typeof o.text === "string" &&
    typeof o.completed === "boolean" &&
    typeof o.createdAt === "string"
  );
}

/**
 * @param {Todo[]} todos
 * @returns {string}
 */
export function serializeTodos(todos) {
  return JSON.stringify(todos);
}

/**
 * @param {Todo[]} todos
 * @param {{ id: string, text: string, createdAt: string }} fields
 */
export function addTodoAtFront(todos, { id, text, createdAt }) {
  const trimmed = text.trim();
  if (!trimmed) return false;
  todos.unshift({
    id,
    text: trimmed,
    completed: false,
    createdAt,
  });
  return true;
}

/**
 * @param {Todo[]} todos
 * @param {string} id
 * @param {boolean} completed
 * @returns {boolean} whether a todo was updated
 */
export function setTodoCompleted(todos, id, completed) {
  const t = todos.find((x) => x.id === id);
  if (!t) return false;
  t.completed = completed;
  return true;
}

/**
 * @param {Todo[]} todos
 * @param {string} id
 * @returns {boolean} whether a todo was removed
 */
export function deleteTodoById(todos, id) {
  const i = todos.findIndex((x) => x.id === id);
  if (i === -1) return false;
  todos.splice(i, 1);
  return true;
}
