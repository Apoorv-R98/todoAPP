const STORAGE_KEY = "todoapp:todos";

const listEl = document.getElementById("list");
const formEl = document.getElementById("add-form");
const inputEl = document.getElementById("new-todo");
const errEl = document.getElementById("err");

function showError(message) {
  errEl.textContent = message;
  errEl.hidden = !message;
}

function readTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
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
      const t = todos.find((x) => x.id === todo.id);
      if (t) t.completed = checkbox.checked;
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
      const i = todos.findIndex((x) => x.id === todo.id);
      if (i !== -1) todos.splice(i, 1);
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
    todos.unshift({
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    });
  });
  inputEl.value = "";
});

renderList(readTodos());
