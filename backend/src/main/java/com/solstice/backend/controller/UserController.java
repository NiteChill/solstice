package com.solstice.backend.controller;

import com.solstice.backend.dto.CheckAvailabilityRequest;
import com.solstice.backend.dto.ResourceAvailabilityResponse;
import com.solstice.backend.dto.UpdateAvatarRequest;
import com.solstice.backend.dto.UpdateProfileRequest;
import com.solstice.backend.dto.UserResponse;
import com.solstice.backend.entity.User;
import com.solstice.backend.service.ProfileService;
import com.solstice.backend.service.UserService;
import jakarta.validation.Valid;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final ProfileService profileService;

  @GetMapping("/availability")
  public ResourceAvailabilityResponse checkAvailability(
    @Valid CheckAvailabilityRequest request
  ) {
    if (request.username() != null) {
      return new ResourceAvailabilityResponse(
        userService.isHandleAvailable(request.username())
      );
    }
    return new ResourceAvailabilityResponse(
      userService.isEmailAvailable(request.email())
    );
  }

  @PatchMapping("/me")
  public UserResponse updateMe(
    @AuthenticationPrincipal User currentUser,
    @Valid @RequestBody UpdateProfileRequest request
  ) {
    return userService.updateProfile(currentUser, request);
  }

  @PutMapping("/me/avatar")
  public UserResponse updateAvatar(
    @AuthenticationPrincipal User currentUser,
    @Valid @ModelAttribute UpdateAvatarRequest request
  ) throws IOException {
    return profileService.uploadAvatar(currentUser, request);
  }

  @DeleteMapping("/me/avatar")
  public UserResponse deleteAvatar(@AuthenticationPrincipal User currentUser) {
    return profileService.deleteAvatar(currentUser);
  }
}
