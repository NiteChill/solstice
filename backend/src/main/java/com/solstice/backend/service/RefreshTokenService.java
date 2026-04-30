package com.solstice.backend.service;

import com.solstice.backend.dto.AuthenticationResponse;
import com.solstice.backend.dto.SessionResponse;
import com.solstice.backend.dto.UserResponse;
import com.solstice.backend.entity.RefreshToken;
import com.solstice.backend.entity.User;
import com.solstice.backend.repository.RefreshTokenRepository;
import com.solstice.backend.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;
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
  private final UserAgentAnalyzer uaa;

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
  public void revokeById(Long sessionId, User currentUser) {
    RefreshToken token = refreshTokenRepository.findById(sessionId)
      .orElseThrow(() -> new RuntimeException("Session not found"));

    if (!token.getUser().getId().equals(currentUser.getId())) {
      throw new RuntimeException("Unauthorized: You do not own this session");
    }

    refreshTokenRepository.delete(token);
  }

  @Transactional
  public void revokeAll(User user) {
    refreshTokenRepository.deleteAllByUser(user);
  }

  public List<SessionResponse> getSessions(User user, Long currentSessionId) {
    return refreshTokenRepository.findAllByUser(user).stream().map(rt -> {
      UserAgent agent = uaa.parse(rt.getUserAgent());
      return new SessionResponse(rt.getId(), agent.getValue("DeviceName"), agent.getValue("AgentNameVersion"),
                                 rt.getIpAddress(), rt.getExpiryDate().minusMillis(refreshExpiration),
                                 rt.getId().equals(currentSessionId));
    }).toList();
  }
}