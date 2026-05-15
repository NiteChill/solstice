package com.solstice.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
  @NotBlank(message = "Username is required")
  @Size(max = 50, message = "Name cannot exceed 50 characters")
  String displayName,

  @NotBlank(message = "Email is required")
  @Email(message = "Must be a valid email address")
  @Size(max = 255, message = "Email cannot exceed 255 characters")
  String email,

  @NotBlank(message = "Password is required")
  @Size(min = 8, message = "Password must be at least 8 characters long")
  @Size(max = 100, message = "Password cannot exceed 100 characters")
  @Pattern(
    regexp = "^(?=.*[A-Z])(?=.*\\d).*$",
    message = "Password must contain an uppercase letter and a number"
  )
  String password
) {}
