package com.solstice.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;

import com.solstice.backend.dto.AuthenticationResponse;
import com.solstice.backend.dto.SessionResponse;
import com.solstice.backend.entity.RefreshToken;
import com.solstice.backend.entity.User;
import com.solstice.backend.exception.ResourceNotFoundException;
import com.solstice.backend.exception.SessionDeadException;
import com.solstice.backend.repository.RefreshTokenRepository;
import com.solstice.backend.repository.UserRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import nl.basjes.parse.useragent.UserAgentAnalyzer;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

  @Mock
  private RefreshTokenRepository refreshTokenRepository;
  @Mock
  private UserRepository userRepository;
  @Mock
  private JwtService jwtService;

  private static UserAgentAnalyzer realUaa;

  private RefreshTokenService refreshTokenService;
  private User testUser;
  private final String chromeUa = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
  private final String ipAddress = "127.0.0.1";

  @BeforeAll
  static void initUaa() {
    realUaa = UserAgentAnalyzer.newBuilder().withField("DeviceName").withField("AgentNameVersion")
      .immediateInitialization().build();
  }

  @BeforeEach
  void setUp() {
    testUser = User.builder().id(UUID.randomUUID()).email("achille@solstice.com").build();

    refreshTokenService = new RefreshTokenService(refreshTokenRepository, userRepository, jwtService, realUaa);
    ReflectionTestUtils.setField(refreshTokenService, "refreshExpiration", 604800000L);
  }

  @Test
  void createRefreshTokenShouldSaveNewTokenWhenUserExists() {
    Mockito.when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
    Mockito.when(refreshTokenRepository.findByUserAndUserAgentAndIpAddress(any(), anyString(), anyString()))
      .thenReturn(Optional.empty());
    Mockito.when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(i -> i.getArguments()[0]);

    RefreshToken result = refreshTokenService.createRefreshToken(testUser.getEmail(), chromeUa, ipAddress);

    assertNotNull(result.getToken());
    assertEquals(testUser, result.getUser());
    Mockito.verify(refreshTokenRepository).save(any(RefreshToken.class));
  }

  @Test
  void createRefreshTokenShouldThrowResourceNotFoundWhenUserMissing() {
    Mockito.when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

    assertThrows(ResourceNotFoundException.class,
                 () -> refreshTokenService.createRefreshToken("fake@email.com", chromeUa, ipAddress));
  }

  @Test
  void rotateTokenShouldWorkWhenDetailsMatch() {
    String oldTokenStr = "old-token-uuid";
    RefreshToken oldToken = RefreshToken.builder().id(1L).token(oldTokenStr).user(testUser).userAgent(chromeUa)
      .ipAddress(ipAddress).expiryDate(Instant.now().plus(1, ChronoUnit.HOURS)).build();

    Mockito.when(refreshTokenRepository.findByToken(oldTokenStr)).thenReturn(Optional.of(oldToken));
    Mockito.when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
    Mockito.when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(i -> i.getArguments()[0]);
    Mockito.when(jwtService.generateToken(anyMap(), Mockito.eq(testUser))).thenReturn("new-access-token");

    AuthenticationResponse response = refreshTokenService.rotateToken(oldTokenStr, chromeUa, ipAddress);

    assertNotNull(response.refreshToken());
    assertEquals("new-access-token", response.accessToken());
    Mockito.verify(refreshTokenRepository).delete(oldToken);
    Mockito.verify(refreshTokenRepository).save(any(RefreshToken.class));
  }

  @Test
  void rotateTokenShouldNukeAllSessionsWhenSecurityMismatch() {
    String stolenTokenStr = "stolen-token";
    RefreshToken stolenToken = RefreshToken.builder().user(testUser).userAgent(chromeUa).ipAddress(ipAddress).build();

    Mockito.when(refreshTokenRepository.findByToken(stolenTokenStr)).thenReturn(Optional.of(stolenToken));

    assertThrows(SessionDeadException.class,
                 () -> refreshTokenService.rotateToken(stolenTokenStr, "Firefox", ipAddress));

    Mockito.verify(refreshTokenRepository).deleteAllByUser(testUser);
    Mockito.verify(refreshTokenRepository, Mockito.never()).delete(any());
  }

  @Test
  void rotateTokenShouldThrowSessionDeadWhenExpired() {
    RefreshToken expiredToken = RefreshToken.builder().token("expired").user(testUser).userAgent(chromeUa)
      .ipAddress(ipAddress).expiryDate(Instant.now().minus(1, ChronoUnit.MINUTES)).build();

    Mockito.when(refreshTokenRepository.findByToken("expired")).thenReturn(Optional.of(expiredToken));

    assertThrows(SessionDeadException.class, () -> refreshTokenService.rotateToken("expired", chromeUa, ipAddress));

    Mockito.verify(refreshTokenRepository).delete(expiredToken);
  }

  @Test
  void revokeTokenByIdShouldDeleteWhenOwner() {
    RefreshToken rt = RefreshToken.builder().id(10L).user(testUser).build();
    Mockito.when(refreshTokenRepository.findById(10L)).thenReturn(Optional.of(rt));

    refreshTokenService.revokeTokenById(10L, testUser);

    Mockito.verify(refreshTokenRepository).delete(rt);
  }

  @Test
  void revokeTokenByIdShouldThrowSessionDeadWhenNotOwner() {
    RefreshToken rt = RefreshToken.builder().id(10L).user(testUser).build();
    User hacker = User.builder().id(UUID.randomUUID()).build();

    Mockito.when(refreshTokenRepository.findById(10L)).thenReturn(Optional.of(rt));

    assertThrows(SessionDeadException.class, () -> refreshTokenService.revokeTokenById(10L, hacker));
  }

  @Test
  void getSessionsShouldMapCorrectly() {
    RefreshToken rt = RefreshToken.builder().id(1L).user(testUser).userAgent(chromeUa).ipAddress(ipAddress)
      .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS)).build();

    Mockito.when(refreshTokenRepository.findAllByUser(testUser)).thenReturn(List.of(rt));

    List<SessionResponse> sessions = refreshTokenService.getSessions(testUser, 1L);

    assertFalse(sessions.isEmpty());
    assertEquals("Desktop", sessions.get(0).deviceName());
    assertTrue(sessions.get(0).isCurrent());
  }
}