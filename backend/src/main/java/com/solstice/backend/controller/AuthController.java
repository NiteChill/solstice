package com.solstice.backend.controller;

import com.solstice.backend.dto.AuthenticationResponse;
import com.solstice.backend.dto.LoginRequest;
import com.solstice.backend.dto.RefreshTokenRequest;
import com.solstice.backend.dto.RegisterRequest;
import com.solstice.backend.dto.SessionResponse;
import com.solstice.backend.dto.UserResponse;
import com.solstice.backend.entity.User;
import com.solstice.backend.service.JwtService;
import com.solstice.backend.service.RefreshTokenService;
import com.solstice.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final UserService userService;
  private final RefreshTokenService refreshTokenService;
  private final JwtService jwtService;

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  public AuthenticationResponse register(@RequestBody RegisterRequest request, HttpServletRequest servletRequest) {
    String userAgent = servletRequest.getHeader("User-Agent");
    String ipAddress = servletRequest.getRemoteAddr();
    return userService.registerUser(request, userAgent, ipAddress);
  }

  @PostMapping("/login")
  @ResponseStatus(HttpStatus.OK)
  public AuthenticationResponse login(@RequestBody LoginRequest request, HttpServletRequest servletRequest) {
    String userAgent = servletRequest.getHeader("User-Agent");
    String ipAddress = servletRequest.getRemoteAddr();
    return userService.loginUser(request, userAgent, ipAddress);
  }

  @GetMapping("/me")
  public UserResponse getMyProfile(@AuthenticationPrincipal User currentUser) {
    return UserResponse.fromEntity(currentUser);
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(@AuthenticationPrincipal User currentUser, @RequestBody RefreshTokenRequest request) {
    refreshTokenService.revokeCurrentToken(request.refreshToken(), currentUser);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/logout-all")
  public ResponseEntity<?> logoutAll(@AuthenticationPrincipal User currentUser) {
    refreshTokenService.revokeAll(currentUser);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/refresh")
  public AuthenticationResponse refresh(@RequestBody RefreshTokenRequest request, HttpServletRequest servletRequest) {
    String userAgent = servletRequest.getHeader("User-Agent");
    String ipAddress = servletRequest.getRemoteAddr();
    return refreshTokenService.rotateToken(request.refreshToken(), userAgent, ipAddress);
  }

  @GetMapping("/sessions")
  public List<SessionResponse> getSessions(@AuthenticationPrincipal User currentUser,
                                           HttpServletRequest servletRequest) {
    String authHeader = servletRequest.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      throw new RuntimeException("Missing or invalid Authorization header");
    }
    String token = authHeader.substring(7);
    Long currentSessionId = jwtService.extractClaim(token, claims -> claims.get("sid", Long.class));
    return refreshTokenService.getSessions(currentUser, currentSessionId);
  }

  @DeleteMapping("/sessions/{id}")
  public ResponseEntity<?> revokeSession(@AuthenticationPrincipal User currentUser, @PathVariable Long id) {
    refreshTokenService.revokeTokenById(id, currentUser);
    return ResponseEntity.noContent().build();
  }
}
