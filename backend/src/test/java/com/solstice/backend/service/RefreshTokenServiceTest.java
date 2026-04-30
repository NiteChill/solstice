package com.solstice.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

import com.solstice.backend.dto.SessionResponse;
import com.solstice.backend.entity.RefreshToken;
import com.solstice.backend.entity.User;
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
  void createRefreshTokenShouldSaveNewTokenWhenNoExistingSession() {
    Mockito.when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
    Mockito.when(refreshTokenRepository.findByUserAndUserAgentAndIpAddress(any(), anyString(), anyString()))
      .thenReturn(Optional.empty());
    Mockito.when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(i -> i.getArguments()[0]);

    RefreshToken result = refreshTokenService.createRefreshToken(testUser.getEmail(), chromeUa, "127.0.0.1");

    assertNotNull(result.getToken());
    assertEquals(testUser, result.getUser());
    Mockito.verify(refreshTokenRepository).save(any(RefreshToken.class));
  }

  @Test
  void getSessionsShouldCorrectlyMapRealUserAgentData() {

    Long currentId = 1L;
    RefreshToken rt = RefreshToken.builder().id(1L).user(testUser).userAgent(chromeUa).ipAddress("127.0.0.1")
      .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS)).build();

    Mockito.when(refreshTokenRepository.findAllByUser(testUser)).thenReturn(List.of(rt));

    List<SessionResponse> sessions = refreshTokenService.getSessions(testUser, currentId);

    assertFalse(sessions.isEmpty());
    SessionResponse session = sessions.get(0);

    assertEquals("Desktop", session.deviceName());
    assertTrue(session.browser().contains("Chrome"));
    assertTrue(session.isCurrent());
  }

  @Test
  void revokeByIdShouldVerifyOwnershipBeforeDeleting() {
    RefreshToken rt = RefreshToken.builder().id(10L).user(testUser).build();

    Mockito.when(refreshTokenRepository.findById(10L)).thenReturn(Optional.of(rt));

    refreshTokenService.revokeById(10L, testUser);
    Mockito.verify(refreshTokenRepository).delete(rt);

    User stranger = User.builder().id(UUID.randomUUID()).build();
    assertThrows(RuntimeException.class, () -> refreshTokenService.revokeById(10L, stranger));
  }
}