package com.solstice.backend.controller;

import com.solstice.backend.dto.AuthResult;
import com.solstice.backend.dto.AuthenticationResponse;
import com.solstice.backend.dto.LoginRequest;
import com.solstice.backend.dto.RegisterRequest;
import com.solstice.backend.dto.SessionResponse;
import com.solstice.backend.dto.UserResponse;
import com.solstice.backend.entity.User;
import com.solstice.backend.service.JwtService;
import com.solstice.backend.service.RefreshTokenService;
import com.solstice.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final UserService userService;
  private final RefreshTokenService refreshTokenService;
  private final JwtService jwtService;

  @Value("${jwt.refresh-expiration}")
  private long refreshExpiration;

  @Value("${app.env:dev}")
  private String env;

  private ResponseCookie generateCookie(String refreshToken) {
    boolean isProd = "prod".equalsIgnoreCase(env);
    return ResponseCookie.from("solstice_rt", refreshToken).httpOnly(true).secure(isProd)
      .sameSite(isProd ? "Strict" : "Lax").path("/api/v1/auth").maxAge(refreshExpiration / 1000).build();
  }

  private ResponseCookie generateSessionCookie(long maxAge) {
    boolean isProd = "prod".equalsIgnoreCase(env);
    return ResponseCookie.from("solstice_session", "true").httpOnly(false).secure(isProd)
      .sameSite(isProd ? "Strict" : "Lax").path("/").maxAge(maxAge).build();
  }

  @PostMapping("/register")
  public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request,
                                                         HttpServletRequest servletRequest) {
    String userAgent = servletRequest.getHeader("User-Agent");
    String ipAddress = servletRequest.getRemoteAddr();
    AuthResult result = userService.registerUser(request, userAgent, ipAddress);
    return ResponseEntity.status(HttpStatus.CREATED)
      .header(HttpHeaders.SET_COOKIE, generateCookie(result.refreshToken()).toString())
      .header(HttpHeaders.SET_COOKIE, generateSessionCookie(refreshExpiration / 1000).toString())
      .body(result.response());
  }

  @PostMapping("/login")
  public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody LoginRequest request,
                                                      HttpServletRequest servletRequest) {
    String userAgent = servletRequest.getHeader("User-Agent");
    String ipAddress = servletRequest.getRemoteAddr();
    AuthResult result = userService.loginUser(request, userAgent, ipAddress);
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, generateCookie(result.refreshToken()).toString())
      .header(HttpHeaders.SET_COOKIE, generateSessionCookie(refreshExpiration / 1000).toString())
      .body(result.response());
  }

  @GetMapping("/me")
  public UserResponse getMyProfile(@AuthenticationPrincipal User currentUser) {
    return UserResponse.fromEntity(currentUser);
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(@AuthenticationPrincipal User currentUser,
                                  @CookieValue(name = "solstice_rt", required = false) String refreshToken) {
    if (refreshToken != null) {
      refreshTokenService.revokeCurrentToken(refreshToken, currentUser);
    }
    ResponseCookie deleteCookie = ResponseCookie.from("solstice_rt", "").httpOnly(true)
      .secure("prod".equalsIgnoreCase(env)).sameSite("prod".equalsIgnoreCase(env) ? "Strict" : "Lax")
      .path("/api/v1/auth").maxAge(0).build();
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
      .header(HttpHeaders.SET_COOKIE, generateSessionCookie(0).toString()).build();
  }

  @PostMapping("/logout-all")
  public ResponseEntity<?> logoutAll(@AuthenticationPrincipal User currentUser) {
    refreshTokenService.revokeAll(currentUser);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/refresh")
  public ResponseEntity<AuthenticationResponse> refresh(@CookieValue(name = "solstice_rt", required = false) String refreshToken,
                                                        HttpServletRequest servletRequest) {
    if (refreshToken == null || refreshToken.isBlank()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    String userAgent = servletRequest.getHeader("User-Agent");
    String ipAddress = servletRequest.getRemoteAddr();
    AuthResult result = refreshTokenService.rotateToken(refreshToken, userAgent, ipAddress);
    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, generateCookie(result.refreshToken()).toString())
      .header(HttpHeaders.SET_COOKIE, generateSessionCookie(refreshExpiration / 1000).toString())
      .body(result.response());
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
