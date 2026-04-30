package com.solstice.backend.dto;

public record AuthenticationResponse(String accessToken, String refreshToken, UserResponse user) {
}