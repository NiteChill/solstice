package com.solstice.backend.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
  @Size(max = 50, message = "Name cannot exceed 50 characters") String name,

  @Size(max = 500, message = "Bio cannot exceed 500 characters") String bio,

  @Size(min = 3, message = "Username must be at least 3 characters")
  @Size(max = 20, message = "Username cannot exceed 20 characters")
  @Pattern(
    regexp = "^[a-z0-9_]+$",
    message = "Username must be alphanumeric and underscores only"
  )
  String username
) {}
