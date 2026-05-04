package com.solstice.backend.dto;

import com.solstice.backend.entity.User;
import java.util.UUID;

public record UserResponse(UUID id, String displayName, String username, String email, String role) {
  public static UserResponse fromEntity(User user) {
    return new UserResponse(user.getId(), user.getDisplayName(), user.getHandle(), user.getEmail(),
                            user.getRole().name());
  }
}
