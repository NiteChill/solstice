package com.solstice.backend.dto;

import java.time.Instant;

public record SessionResponse(
  Long id,
  String device,
  String os,
  String browser,
  String location,
  Instant lastActive,
  boolean isCurrent
) {}
