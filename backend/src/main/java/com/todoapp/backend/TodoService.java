package com.todoapp.backend;

import com.todoapp.backend.dto.TodoCreateRequest;
import com.todoapp.backend.dto.TodoUpdateRequest;
import com.todoapp.backend.model.Todo;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TodoService {

  private final List<Todo> todos = new ArrayList<>();

  public synchronized List<Todo> findAll() {
    return List.copyOf(todos);
  }

  public synchronized Todo create(TodoCreateRequest request) {
    String trimmed = request.text().trim();
    if (trimmed.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "text is required");
    }
    Todo todo =
        new Todo(
            UUID.randomUUID().toString(),
            trimmed,
            false,
            Instant.now().toString());
    todos.add(0, todo);
    return todo;
  }

  public synchronized Todo update(String id, TodoUpdateRequest body) {
    Todo todo =
        findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));
    if (body.text() != null) {
      String trimmed = body.text().trim();
      if (trimmed.isEmpty()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "text cannot be empty");
      }
      todo.setText(trimmed);
    }
    if (body.completed() != null) {
      todo.setCompleted(body.completed());
    }
    return todo;
  }

  public synchronized void deleteById(String id) {
    boolean removed = todos.removeIf(t -> t.getId().equals(id));
    if (!removed) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found");
    }
  }

  private Optional<Todo> findById(String id) {
    return todos.stream().filter(t -> t.getId().equals(id)).findFirst();
  }
}
