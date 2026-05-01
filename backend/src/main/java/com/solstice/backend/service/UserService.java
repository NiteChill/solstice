package com.solstice.backend.service;

import com.solstice.backend.dto.AuthenticationResponse;
import com.solstice.backend.dto.LoginRequest;
import com.solstice.backend.dto.RegisterRequest;
import com.solstice.backend.dto.UserResponse;
import com.solstice.backend.entity.RefreshToken;
import com.solstice.backend.entity.Role;
import com.solstice.backend.entity.User;
import com.solstice.backend.exception.EmailAlreadyTakenException;
import com.solstice.backend.exception.InvalidCredentialsException;
import com.solstice.backend.repository.UserRepository;
import java.util.HashMap;
import java.util.Map;
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
  public AuthenticationResponse registerUser(RegisterRequest request, String userAgent, String ipAddress) {
    if (userRepository.findByEmail(request.email()).isPresent()) {
      throw new EmailAlreadyTakenException("Email is already registered: " + request.email());
    }

    User user = User.builder().email(request.email()).password(passwordEncoder.encode(request.password()))
      .role(Role.USER).build();

    User savedUser = userRepository.save(user);

    RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser.getEmail(), userAgent, ipAddress);

    Map<String, Object> claims = new HashMap<>();
    claims.put("sid", refreshToken.getId());

    String accessToken = jwtService.generateToken(claims, user);

    return new AuthenticationResponse(accessToken, refreshToken.getToken(), UserResponse.fromEntity(savedUser));
  }

  @Transactional
  public AuthenticationResponse loginUser(LoginRequest request, String userAgent, String ipAddress) {
    User user = userRepository.findByEmail(request.email())
      .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

    if (!passwordEncoder.matches(request.password(), user.getPassword())) {
      throw new InvalidCredentialsException("Invalid email or password");
    }

    RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getEmail(), userAgent, ipAddress);

    Map<String, Object> claims = new HashMap<>();
    claims.put("sid", refreshToken.getId());

    String accessToken = jwtService.generateToken(claims, user);

    return new AuthenticationResponse(accessToken, refreshToken.getToken(), UserResponse.fromEntity(user));
  }
}
