import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseStoredTodos,
  serializeTodos,
  addTodoAtFront,
  setTodoCompleted,
  deleteTodoById,
} from "../public/todo-logic.js";

describe("parseStoredTodos", () => {
  it("returns empty array for null, empty, or invalid JSON", () => {
    assert.deepEqual(parseStoredTodos(null), []);
    assert.deepEqual(parseStoredTodos(""), []);
    assert.deepEqual(parseStoredTodos("{"), []);
  });

  it("returns empty array for non-array JSON", () => {
    assert.deepEqual(parseStoredTodos("{}"), []);
    assert.deepEqual(parseStoredTodos('"x"'), []);
  });

  it("filters out invalid todo objects", () => {
    const raw = JSON.stringify([
      { id: "1", text: "a", completed: false, createdAt: "t0" },
      { id: "2", text: "bad" },
      null,
    ]);
    assert.deepEqual(parseStoredTodos(raw), [
      { id: "1", text: "a", completed: false, createdAt: "t0" },
    ]);
  });

  it("parses valid list", () => {
    const todos = [{ id: "a", text: "x", completed: true, createdAt: "t1" }];
    assert.deepEqual(parseStoredTodos(JSON.stringify(todos)), todos);
  });
});

describe("serializeTodos", () => {
  it("round-trips with parseStoredTodos", () => {
    const todos = [{ id: "1", text: "hi", completed: false, createdAt: "t" }];
    assert.deepEqual(parseStoredTodos(serializeTodos(todos)), todos);
  });
});

describe("addTodoAtFront", () => {
  it("returns false and does not mutate for blank text", () => {
    const todos = [];
    assert.equal(addTodoAtFront(todos, { id: "1", text: "   ", createdAt: "t" }), false);
    assert.deepEqual(todos, []);
  });

  it("trims text and prepends", () => {
    const todos = [{ id: "0", text: "old", completed: false, createdAt: "t0" }];
    assert.equal(
      addTodoAtFront(todos, { id: "1", text: "  new  ", createdAt: "t1" }),
      true,
    );
    assert.deepEqual(todos, [
      { id: "1", text: "new", completed: false, createdAt: "t1" },
      { id: "0", text: "old", completed: false, createdAt: "t0" },
    ]);
  });
});

describe("setTodoCompleted", () => {
  it("returns false when id missing", () => {
    const todos = [{ id: "1", text: "a", completed: false, createdAt: "t" }];
    assert.equal(setTodoCompleted(todos, "x", true), false);
    assert.equal(todos[0].completed, false);
  });

  it("updates completion", () => {
    const todos = [{ id: "1", text: "a", completed: false, createdAt: "t" }];
    assert.equal(setTodoCompleted(todos, "1", true), true);
    assert.equal(todos[0].completed, true);
  });
});

describe("deleteTodoById", () => {
  it("returns false when id missing", () => {
    const todos = [{ id: "1", text: "a", completed: false, createdAt: "t" }];
    assert.equal(deleteTodoById(todos, "x"), false);
    assert.equal(todos.length, 1);
  });

  it("removes matching todo", () => {
    const todos = [
      { id: "1", text: "a", completed: false, createdAt: "t" },
      { id: "2", text: "b", completed: true, createdAt: "t" },
    ];
    assert.equal(deleteTodoById(todos, "1"), true);
    assert.deepEqual(todos, [{ id: "2", text: "b", completed: true, createdAt: "t" }]);
  });
});
