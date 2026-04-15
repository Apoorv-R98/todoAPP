package com.todoapp.backend;

import com.todoapp.backend.dto.TodoCreateRequest;
import com.todoapp.backend.dto.TodoUpdateRequest;
import com.todoapp.backend.model.Todo;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

  private final TodoService todoService;

  public TodoController(TodoService todoService) {
    this.todoService = todoService;
  }

  @GetMapping
  public List<Todo> list() {
    return todoService.findAll();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Todo create(@Valid @RequestBody TodoCreateRequest body) {
    return todoService.create(body);
  }

  @PatchMapping("/{id}")
  public Todo update(@PathVariable String id, @RequestBody TodoUpdateRequest body) {
    return todoService.update(id, body);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable String id) {
    todoService.deleteById(id);
  }
}
