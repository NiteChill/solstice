package com.solstice.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

import com.solstice.backend.dto.AuthenticationResponse;
import com.solstice.backend.dto.LoginRequest;
import com.solstice.backend.dto.RegisterRequest;
éimport com.solstice.backend.entity.RefreshToken;
import com.solstice.backend.entity.Role;
import com.solstice.backend.entity.User;
import com.solstice.backend.exception.EmailAlreadyTakenException;
import com.solstice.backend.exception.InvalidCredentialsException;
import com.solstice.backend.repository.UserRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
  @Mock
  private UserRepository userRepository;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private JwtService jwtService;

  @Mock
  private RefreshTokenService refreshTokenService;

  @InjectMocks
  private UserService userService;

  @Test
  void registerUserShouldReturnResponseWhenEmailIsUnique() {
    RegisterRequest request = new RegisterRequest("achille@solstice.com", "password123");
    String userAgent = "Mozilla/5.0";
    String ipAddress = "127.0.0.1";
    UUID fakeId = UUID.randomUUID();

    Mockito.when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());
    Mockito.when(passwordEncoder.encode(request.password())).thenReturn("hashed_password");

    User savedEntity = User.builder().id(fakeId).email(request.email()).password("hashed_password").role(Role.USER)
      .build();

    Mockito.when(userRepository.save(any(User.class))).thenReturn(savedEntity);
    Mockito.when(jwtService.generateToken(any(User.class))).thenReturn("mock-access-token");

    RefreshToken mockRefreshToken = RefreshToken.builder().token("mock-refresh-token").build();
    Mockito.when(refreshTokenService.createRefreshToken(anyString(), anyString(), anyString()))
      .thenReturn(mockRefreshToken);

    AuthenticationResponse response = userService.registerUser(request, userAgent, ipAddress);

    assertNotNull(response);
    assertEquals("mock-access-token", response.accessToken());
    assertEquals("mock-refresh-token", response.refreshToken());
    assertEquals(fakeId, response.user().id());
    assertEquals(request.email(), response.user().email());

    Mockito.verify(userRepository, Mockito.times(1)).save(any(User.class));
    Mockito.verify(refreshTokenService).createRefreshToken(request.email(), userAgent, ipAddress);
  }

  @Test
  void registerUserShouldThrowExceptionWhenEmailIsTaken() {
    RegisterRequest request = new RegisterRequest("achille@solstice.com", "password123");

    User existingUser = User.builder().email("achille@solstice.com").build();
    Mockito.when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(existingUser));

    assertThrows(EmailAlreadyTakenException.class, () -> userService.registerUser(request, "UA", "127.0.0.1"));

    Mockito.verify(userRepository, Mockito.never()).save(any(User.class));
  }

  @Test
  void loginUserShouldReturnResponseWhenCredentialsAreValid() {
    LoginRequest request = new LoginRequest("achille@solstice.com", "password123");
    String userAgent = "Mozilla/5.0";
    String ipAddress = "127.0.0.1";
    User dummyUser = User.builder().id(UUID.randomUUID()).email("achille@solstice.com").password("hashed_password")
      .role(Role.USER).build();

    Mockito.when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(dummyUser));
    Mockito.when(passwordEncoder.matches(request.password(), dummyUser.getPassword())).thenReturn(true);
    Mockito.when(jwtService.generateToken(any(User.class))).thenReturn("mock-access-token");

    RefreshToken mockRefreshToken = RefreshToken.builder().token("mock-refresh-token").build();
    Mockito.when(refreshTokenService.createRefreshToken(anyString(), anyString(), anyString()))
      .thenReturn(mockRefreshToken);

    AuthenticationResponse response = userService.loginUser(request, userAgent, ipAddress);

    assertNotNull(response);
    assertEquals("mock-access-token", response.accessToken());
    assertEquals("mock-refresh-token", response.refreshToken());
    assertEquals("achille@solstice.com", response.user().email());

    Mockito.verify(refreshTokenService).createRefreshToken(request.email(), userAgent, ipAddress);
  }

  @Test
  void loginUserShouldThrowExceptionWhenEmailNotFound() {
    LoginRequest request = new LoginRequest("ghost@solstice.com", "password123");
    Mockito.when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());

    assertThrows(InvalidCredentialsException.class, () -> userService.loginUser(request, "UA", "127.0.0.1"));
  }

  @Test
  void loginUserShouldThrowExceptionWhenPasswordIsWrong() {
    LoginRequest request = new LoginRequest("achille@solstice.com", "wrongpassword");
    User dummyUser = User.builder().email("achille@solstice.com").password("hashed_password").build();

    Mockito.when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(dummyUser));
    Mockito.when(passwordEncoder.matches(request.password(), dummyUser.getPassword())).thenReturn(false);

    assertThrows(InvalidCredentialsException.class, () -> userService.loginUser(request, "UA", "127.0.0.1"));
  }
}