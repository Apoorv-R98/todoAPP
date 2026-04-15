import {
  STORAGE_KEY,
  parseStoredTodos,
  serializeTodos,
  addTodoAtFront,
  setTodoCompleted,
  deleteTodoById,
} from "./todo-logic.js";

const listEl = document.getElementById("list");
const formEl = document.getElementById("add-form");
const inputEl = document.getElementById("new-todo");
const errEl = document.getElementById("err");

function showError(message) {
  errEl.textContent = message;
  errEl.hidden = !message;
}

function readTodos() {
  return parseStoredTodos(localStorage.getItem(STORAGE_KEY));
}

function writeTodos(todos) {
  localStorage.setItem(STORAGE_KEY, serializeTodos(todos));
}

function mutate(updater) {
  showError("");
  try {
    const todos = readTodos();
    updater(todos);
    writeTodos(todos);
    renderList(todos);
  } catch (e) {
    if (e?.name === "QuotaExceededError") {
      showError("Browser storage is full; free some space or remove old todos.");
    } else {
      showError(e?.message || "Something went wrong.");
    }
  }
}

function renderList(todos) {
  listEl.innerHTML = "";
  if (!todos.length) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "No todos yet. Add one above.";
    listEl.appendChild(p);
    return;
  }
  for (const todo of todos) {
    listEl.appendChild(renderItem(todo));
  }
}

function renderItem(todo) {
  const li = document.createElement("li");
  li.className = `item${todo.completed ? " completed" : ""}`;
  li.dataset.id = todo.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.setAttribute("aria-label", "Completed");
  checkbox.addEventListener("change", () => {
    mutate((todos) => {
      setTodoCompleted(todos, todo.id, checkbox.checked);
    });
  });

  const span = document.createElement("span");
  span.className = "item-text";
  span.textContent = todo.text;

  const actions = document.createElement("div");
  actions.className = "item-actions";

  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete";
  del.textContent = "Delete";
  del.addEventListener("click", () => {
    mutate((todos) => {
      deleteTodoById(todos, todo.id);
    });
  });

  actions.appendChild(del);
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(actions);
  return li;
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  mutate((todos) => {
    addTodoAtFront(todos, {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    });
  });
  inputEl.value = "";
});

renderList(readTodos());
