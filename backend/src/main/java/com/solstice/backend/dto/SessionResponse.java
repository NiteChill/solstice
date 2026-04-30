package com.solstice.backend.dto;

import java.time.Instant;

public record SessionResponse(Long id, String deviceName, String browser, String ipAddress, Instant lastActive,
  boolean isCurrent) {
}