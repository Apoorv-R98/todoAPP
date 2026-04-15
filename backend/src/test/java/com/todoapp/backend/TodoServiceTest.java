package com.todoapp.backend;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.todoapp.backend.dto.TodoCreateRequest;
import com.todoapp.backend.dto.TodoUpdateRequest;
import com.todoapp.backend.model.Todo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class TodoServiceTest {

  private TodoService service;

  @BeforeEach
  void setUp() {
    service = new TodoService();
  }

  @Test
  void createPrependsAndLists() {
    Todo a = service.create(new TodoCreateRequest("first"));
    Todo b = service.create(new TodoCreateRequest("second"));
    assertThat(service.findAll()).containsExactly(b, a);
  }

  @Test
  void createRejectsBlankAfterTrim() {
    assertThatThrownBy(() -> service.create(new TodoCreateRequest("   ")))
        .isInstanceOf(ResponseStatusException.class);
  }

  @Test
  void updateTextAndCompleted() {
    Todo t = service.create(new TodoCreateRequest("x"));
    Todo updated = service.update(t.getId(), new TodoUpdateRequest("y", true));
    assertThat(updated.getText()).isEqualTo("y");
    assertThat(updated.isCompleted()).isTrue();
  }

  @Test
  void deleteRemoves() {
    Todo t = service.create(new TodoCreateRequest("x"));
    service.deleteById(t.getId());
    assertThat(service.findAll()).isEmpty();
  }

  @Test
  void deleteUnknownThrows() {
    assertThatThrownBy(() -> service.deleteById("missing"))
        .isInstanceOf(ResponseStatusException.class);
  }
}
