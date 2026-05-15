package com.solstice.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LoginRequest(
  @NotBlank(message = "Username or email is required")
  @Size(max = 255, message = "Identifier cannot exceed 255 characters")
  String identifier,

  @NotBlank(message = "Password is required")
  @Size(min = 8, message = "Password must be at least 8 characters long")
  @Size(max = 100, message = "Password cannot exceed 100 characters")
  @Pattern(
    regexp = "^(?=.*[A-Z])(?=.*\\d).*$",
    message = "Password must contain an uppercase letter and a number"
  )
  String password
) {}
