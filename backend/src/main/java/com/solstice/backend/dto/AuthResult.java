package com.solstice.backend.dto;

public record AuthResult(AuthenticationResponse response, String refreshToken) {
}
