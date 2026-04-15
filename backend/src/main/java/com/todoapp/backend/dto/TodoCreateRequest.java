package com.todoapp.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record TodoCreateRequest(@NotBlank String text) {}
