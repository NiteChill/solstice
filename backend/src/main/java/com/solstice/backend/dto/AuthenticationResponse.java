package com.solstice.backend.dto;

public record AuthenticationResponse(
  String token,
  UserResponse user
) {}