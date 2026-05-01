package com.solstice.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

class JwtServiceTest {

  private JwtService jwtService;
  private UserDetails dummyUser;

  @BeforeEach
  void setUp() {
    jwtService = new JwtService();

    ReflectionTestUtils.setField(jwtService, "secretKey",
                                 "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
    ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L);

    dummyUser = new User("achille@solstice.com", "password", Collections.emptyList());
  }

  @Test
  void shouldGenerateAndValidateToken() {
    String token = jwtService.generateToken(dummyUser);
    assertNotNull(token);

    String extractedUsername = jwtService.extractUsername(token);
    assertEquals("achille@solstice.com", extractedUsername);

    assertTrue(jwtService.isTokenValid(token, dummyUser));
  }
}