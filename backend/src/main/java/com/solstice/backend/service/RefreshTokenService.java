package com.solstice.backend.service;

import com.solstice.backend.dto.AuthenticationResponse;
import com.solstice.backend.dto.UserResponse;
import com.solstice.backend.entity.RefreshToken;
import com.solstice.backend.entity.User;
import com.solstice.backend.repository.RefreshTokenRepository;
import com.solstice.backend.repository.UserRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

  @Value("${jwt.refresh-expiration}")
  private long refreshExpiration;

  private final RefreshTokenRepository refreshTokenRepository;
  private final UserRepository userRepository;
  private final JwtService jwtService;

  public RefreshToken createRefreshToken(String email, String userAgent, String ipAddress) {
    User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

    Optional<RefreshToken> existingToken = refreshTokenRepository.findByUserAndUserAgentAndIpAddress(user, userAgent,
                                                                                                     ipAddress);

    RefreshToken refreshToken;
    if (existingToken.isPresent()) {
      refreshToken = existingToken.get();
    } else {
      refreshToken = new RefreshToken();
      refreshToken.setUser(user);
      refreshToken.setUserAgent(userAgent);
      refreshToken.setIpAddress(ipAddress);
    }

    refreshToken.setToken(UUID.randomUUID().toString());
    refreshToken.setExpiryDate(Instant.now().plusMillis(refreshExpiration));

    return refreshTokenRepository.save(refreshToken);
  }

  @Transactional
  public AuthenticationResponse rotateToken(String oldTokenString) {
    RefreshToken oldToken = refreshTokenRepository.findByToken(oldTokenString)
      .orElseThrow(() -> new RuntimeException("Refresh token not found"));

    verifyExpiration(oldToken);

    User user = oldToken.getUser();
    String userAgent = oldToken.getUserAgent();
    String ipAddress = oldToken.getIpAddress();

    refreshTokenRepository.delete(oldToken);
    RefreshToken newToken = createRefreshToken(user.getEmail(), userAgent, ipAddress);

    return new AuthenticationResponse(jwtService.generateToken(user), newToken.getToken(),
                                      UserResponse.fromEntity(user));
  }

  public RefreshToken verifyExpiration(RefreshToken token) {
    if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
      refreshTokenRepository.delete(token);
      throw new RuntimeException("Refresh token was expired. Please sign in again.");
    }
    return token;
  }

  @Transactional
  public void revokeToken(String tokenString, User user) {
    RefreshToken token = refreshTokenRepository.findByToken(tokenString)
      .orElseThrow(() -> new RuntimeException("Token not found"));
    if (!token.getUser().getId().equals(user.getId())) {
      throw new RuntimeException("Unauthorized: You do not own this session");
    }
    refreshTokenRepository.delete(token);
  }

  @Transactional
  public void revokeAllToken(User user) {
    refreshTokenRepository.deleteByUser(user);
  }
}