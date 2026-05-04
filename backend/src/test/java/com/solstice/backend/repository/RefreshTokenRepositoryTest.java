package com.solstice.backend.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.solstice.backend.entity.RefreshToken;
import com.solstice.backend.entity.Role;
import com.solstice.backend.entity.User;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Tag("integration")
@Transactional
@Testcontainers
class RefreshTokenRepositoryTest {

  @Container
  @ServiceConnection
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

  @Autowired
  private RefreshTokenRepository refreshTokenRepository;

  @Autowired
  private UserRepository userRepository;

  private User testUser;

  @BeforeEach
  void setUp() {
    testUser = User.builder().email("session.test@solstice.com").displayName("Session User").handle("session_handle").password("hashed_pass").role(Role.USER).build();
    userRepository.save(testUser);
  }

  @Test
  void shouldSaveAndFindByToken() {
    String tokenValue = UUID.randomUUID().toString();
    RefreshToken token = RefreshToken.builder().token(tokenValue).user(testUser)
      .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS)).userAgent("Mozilla/5.0").ipAddress("127.0.0.1").build();

    refreshTokenRepository.save(token);
    Optional<RefreshToken> found = refreshTokenRepository.findByToken(tokenValue);

    assertTrue(found.isPresent());
    assertEquals(testUser.getId(), found.get().getUser().getId());
    assertEquals("Mozilla/5.0", found.get().getUserAgent());
  }

  @Test
  void shouldFindExistingSessionByMetadata() {
    String userAgent = "PostmanRuntime/7.37.3";
    String ip = "192.168.1.1";

    RefreshToken token = RefreshToken.builder().token(UUID.randomUUID().toString()).user(testUser).userAgent(userAgent)
      .ipAddress(ip).expiryDate(Instant.now().plus(1, ChronoUnit.HOURS)).build();

    refreshTokenRepository.save(token);

    Optional<RefreshToken> found = refreshTokenRepository.findByUserAndUserAgentAndIpAddress(testUser, userAgent, ip);

    assertTrue(found.isPresent(), "Should find the session matching the device metadata");
    assertEquals(token.getToken(), found.get().getToken());
  }

  @Test
  void shouldDeleteAllTokensBySpecificUser() {
    refreshTokenRepository.save(RefreshToken.builder().token("t1").user(testUser).expiryDate(Instant.now()).build());
    refreshTokenRepository.save(RefreshToken.builder().token("t2").user(testUser).expiryDate(Instant.now()).build());

    User otherUser = User.builder().email("other@solstice.com").displayName("Other User").handle("other_handle").password("pass").role(Role.USER).build();
    userRepository.save(otherUser);
    refreshTokenRepository.save(RefreshToken.builder().token("t3").user(otherUser).expiryDate(Instant.now()).build());

    refreshTokenRepository.deleteAllByUser(testUser);

    assertEquals(0, refreshTokenRepository.findAll().stream().filter(t -> t.getUser().equals(testUser)).count());
    assertEquals(1, refreshTokenRepository.findAll().size(), "The other user's token should still exist");
  }
}