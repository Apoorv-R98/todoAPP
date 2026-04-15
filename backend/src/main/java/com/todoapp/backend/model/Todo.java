package com.todoapp.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Todo {

  private final String id;
  private String text;
  private boolean completed;
  private final String createdAt;

  public Todo(
      @JsonProperty("id") String id,
      @JsonProperty("text") String text,
      @JsonProperty("completed") boolean completed,
      @JsonProperty("createdAt") String createdAt) {
    this.id = id;
    this.text = text;
    this.completed = completed;
    this.createdAt = createdAt;
  }

  public String getId() {
    return id;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public boolean isCompleted() {
    return completed;
  }

  public void setCompleted(boolean completed) {
    this.completed = completed;
  }

  public String getCreatedAt() {
    return createdAt;
  }
}
