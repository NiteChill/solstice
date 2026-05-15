package com.solstice.backend.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CheckAvailabilityRequest(
  @Size(min = 3, message = "Username must be at least 3 characters")
  @Size(max = 20, message = "Username cannot exceed 20 characters")
  @Pattern(
    regexp = "^[a-z0-9_]+$",
    message = "Username must be alphanumeric and underscores only"
  )
  String username,
  @Email(message = "Please enter a valid email address") String email
) {
  @AssertTrue(
    message = "You must provide either a username OR an email, not both."
  )
  private boolean isExactlyOneProvided() {
    boolean hasUsername = username != null && !username.trim().isEmpty();
    boolean hasEmail = email != null && !email.trim().isEmpty();
    return hasUsername ^ hasEmail;
  }
}
