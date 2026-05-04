package com.solstice.backend.dto;

public record AuthenticationResponse(String accessToken, UserResponse user) {
}
