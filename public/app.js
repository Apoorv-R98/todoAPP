const listEl = document.getElementById("list");
const formEl = document.getElementById("add-form");
const inputEl = document.getElementById("new-todo");
const errEl = document.getElementById("err");

function showError(message) {
  errEl.textContent = message;
  errEl.hidden = !message;
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data;
}

function renderItem(todo) {
  const li = document.createElement("li");
  li.className = `item${todo.completed ? " completed" : ""}`;
  li.dataset.id = todo.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.setAttribute("aria-label", "Completed");
  checkbox.addEventListener("change", async () => {
    try {
      const updated = await api(`/api/todos/${todo.id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: checkbox.checked }),
      });
      li.classList.toggle("completed", updated.completed);
    } catch (e) {
      checkbox.checked = todo.completed;
      showError(e.message);
    }
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
  del.addEventListener("click", async () => {
    try {
      await api(`/api/todos/${todo.id}`, { method: "DELETE" });
      li.remove();
      if (!listEl.querySelector(".item")) {
        renderEmpty();
      }
    } catch (e) {
      showError(e.message);
    }
  });

  actions.appendChild(del);
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(actions);
  return li;
}

function renderEmpty() {
  listEl.innerHTML = "";
  const p = document.createElement("p");
  p.className = "empty";
  p.textContent = "No todos yet. Add one above.";
  listEl.appendChild(p);
}

async function loadTodos() {
  showError("");
  try {
    const todos = await api("/api/todos");
    listEl.innerHTML = "";
    if (!todos.length) {
      renderEmpty();
      return;
    }
    for (const todo of todos) {
      listEl.appendChild(renderItem(todo));
    }
  } catch (e) {
    showError(e.message);
  }
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  showError("");
  try {
    const todo = await api("/api/todos", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    inputEl.value = "";
    const empty = listEl.querySelector(".empty");
    if (empty) empty.remove();
    listEl.prepend(renderItem(todo));
  } catch (err) {
    showError(err.message);
  }
});

loadTodos();
