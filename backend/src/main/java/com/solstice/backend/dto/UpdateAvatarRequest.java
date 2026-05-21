package com.solstice.backend.dto;

import com.solstice.backend.validation.ValidFile;
import org.springframework.web.multipart.MultipartFile;

public record UpdateAvatarRequest(
  @ValidFile(message = "Avatar image file is required and cannot be empty")
  MultipartFile file
) {}
