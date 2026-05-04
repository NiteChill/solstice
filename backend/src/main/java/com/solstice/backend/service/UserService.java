package com.solstice.backend.service;

import com.solstice.backend.dto.AuthResult;
import com.solstice.backend.dto.AuthenticationResponse;
import com.solstice.backend.dto.LoginRequest;
import com.solstice.backend.dto.RegisterRequest;
import com.solstice.backend.dto.UserResponse;
import com.solstice.backend.entity.RefreshToken;
import com.solstice.backend.entity.User;
import com.solstice.backend.exception.EmailAlreadyTakenException;
import com.solstice.backend.exception.InvalidCredentialsException;
import com.solstice.backend.repository.UserRepository;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final RefreshTokenService refreshTokenService;

  @Transactional
  public AuthResult registerUser(RegisterRequest request, String userAgent, String ipAddress) {
    if (userRepository.existsByEmail(request.email())) {
      throw new EmailAlreadyTakenException("Email is already registered: " + request.email());
    }

    String uniqueHandle = generateUniqueHandle(request.displayName());

    User user = User.builder().displayName(request.displayName()).handle(uniqueHandle).email(request.email())
      .password(passwordEncoder.encode(request.password())).build();

    User savedUser = userRepository.save(user);

    RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser.getEmail(), userAgent, ipAddress);

    Map<String, Object> claims = new HashMap<>();
    claims.put("sid", refreshToken.getId());

    String accessToken = jwtService.generateToken(claims, user);

    return new AuthResult(new AuthenticationResponse(accessToken, UserResponse.fromEntity(savedUser)),
                          refreshToken.getToken());
  }

  @Transactional
  public AuthResult loginUser(LoginRequest request, String userAgent, String ipAddress) {
    User user = userRepository.findByUsername(request.username())
      .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

    if (!passwordEncoder.matches(request.password(), user.getPassword())) {
      throw new InvalidCredentialsException("Invalid credentials");
    }

    RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getEmail(), userAgent, ipAddress);

    Map<String, Object> claims = new HashMap<>();
    claims.put("sid", refreshToken.getId());

    String accessToken = jwtService.generateToken(claims, user);

    return new AuthResult(new AuthenticationResponse(accessToken, UserResponse.fromEntity(user)),
                          refreshToken.getToken());
  }

  private String generateUniqueHandle(String displayName) {
    String baseName = displayName.trim().toLowerCase().replaceAll("\\s+", "_");

    baseName = baseName.replaceAll("[^a-z0-9_]", "");

    if (baseName.isEmpty()) {
      baseName = "user";
    }

    if (baseName.length() > 15) {
      baseName = baseName.substring(0, 15);
    }

    if (!userRepository.existsByHandle(baseName)) {
      return baseName;
    }

    String randomSuffix = UUID.randomUUID().toString().replace("-", "").substring(0, 5);

    if (baseName.endsWith("_")) {
      return baseName + randomSuffix;
    } else {
      return baseName + "_" + randomSuffix;
    }
  }
}
