package com.solstice.backend.service;

import com.solstice.backend.dto.AuthResult;
import com.solstice.backend.dto.AuthenticationResponse;
import com.solstice.backend.dto.SessionResponse;
import com.solstice.backend.dto.UserResponse;
import com.solstice.backend.entity.RefreshToken;
import com.solstice.backend.entity.User;
import com.solstice.backend.exception.ResourceNotFoundException;
import com.solstice.backend.exception.SessionDeadException;
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
    User user = userRepository.findByEmail(email)
      .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

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
  public AuthResult rotateToken(String oldTokenString, String currentUserAgent, String currentIp) {
    RefreshToken oldToken = refreshTokenRepository.findByToken(oldTokenString)
      .orElseThrow(() -> new SessionDeadException("Session not found. Please log in again."));

    if (!oldToken.getUserAgent().equals(currentUserAgent) || !oldToken.getIpAddress().equals(currentIp)) {
      refreshTokenRepository.deleteAllByUser(oldToken.getUser());
      throw new SessionDeadException("Security Alert: Device or location mismatch. All sessions revoked.");
    }

    verifyExpiration(oldToken);

    User user = oldToken.getUser();

    refreshTokenRepository.delete(oldToken);

    RefreshToken newToken = createRefreshToken(user.getEmail(), currentUserAgent, currentIp);

    java.util.Map<String, Object> claims = new java.util.HashMap<>();
    claims.put("sid", newToken.getId());

    return new AuthResult(new AuthenticationResponse(jwtService.generateToken(claims, user),
                                                     UserResponse.fromEntity(user)),
                          newToken.getToken());
  }

  public RefreshToken verifyExpiration(RefreshToken token) {
    if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
      refreshTokenRepository.delete(token);
      throw new SessionDeadException("Refresh token was expired. Please sign in again.");
    }
    return token;
  }

  @Transactional
  public void revokeCurrentToken(String tokenString, User user) {
    RefreshToken token = refreshTokenRepository.findByToken(tokenString)
      .orElseThrow(() -> new ResourceNotFoundException("Session not found."));

    revokeToken(token, user);
  }

  @Transactional
  public void revokeTokenById(Long sessionId, User user) {
    RefreshToken token = refreshTokenRepository.findById(sessionId)
      .orElseThrow(() -> new ResourceNotFoundException("Session not found."));

    revokeToken(token, user);
  }

  private void revokeToken(RefreshToken token, User user) {
    if (!token.getUser().getId().equals(user.getId())) {
      throw new SessionDeadException("Unauthorized: You do not own this session.");
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