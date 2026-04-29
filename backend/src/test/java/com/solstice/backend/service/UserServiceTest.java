package com.solstice.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

import com.solstice.backend.dto.AuthenticationResponse;
import com.solstice.backend.dto.LoginRequest;
import com.solstice.backend.dto.RegisterRequest;
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

	@InjectMocks
	private UserService userService;

	@Test
	void registerUserShouldReturnResponseWhenEmailIsUnique() {
		RegisterRequest request = new RegisterRequest("achille@solstice.com",
				"password123");
		UUID fakeId = UUID.randomUUID();

		Mockito.when(userRepository.findByEmail(request.email()))
				.thenReturn(Optional.empty());

		Mockito.when(passwordEncoder.encode(request.password()))
				.thenReturn("hashed_password");

		User savedEntity = User.builder().id(fakeId).email(request.email())
				.password("hashed_password").role(Role.USER).build();
		Mockito.when(userRepository.save(any(User.class))).thenReturn(savedEntity);
		Mockito.when(jwtService.generateToken(any(User.class))).thenReturn("mock-token");

		AuthenticationResponse response = userService.registerUser(request);

		assertNotNull(response);
		assertNotNull(response.token());
		assertEquals("mock-token", response.token());
		assertEquals(fakeId, response.user().id());
		assertEquals(request.email(), response.user().email());
		assertEquals("USER", response.user().role());

		Mockito.verify(userRepository, Mockito.times(1)).save(any(User.class));
	}

	@Test
	void registerUserShouldThrowExceptionWhenEmailIsTaken() {
		RegisterRequest request = new RegisterRequest("achille@solstice.com",
				"password123");

		User existingUser = User.builder().email("achille@solstice.com").build();

		Mockito.when(userRepository.findByEmail(request.email()))
				.thenReturn(Optional.of(existingUser));

		EmailAlreadyTakenException exception = assertThrows(
				EmailAlreadyTakenException.class,
				() -> userService.registerUser(request));

		assertEquals("Email is already registered: achille@solstice.com",
				exception.getMessage());

		Mockito.verify(userRepository, Mockito.never()).save(any(User.class));
		Mockito.verify(passwordEncoder, Mockito.never()).encode(anyString());
	}

	@Test
	void loginUserShouldReturnResponseWhenCredentialsAreValid() {
		LoginRequest request = new LoginRequest("achille@solstice.com", "password123");
		User dummyUser = User.builder().id(UUID.randomUUID())
				.email("achille@solstice.com").password("hashed_password").role(Role.USER)
				.build();

		Mockito.when(userRepository.findByEmail(request.email()))
				.thenReturn(Optional.of(dummyUser));
		Mockito.when(passwordEncoder.matches(request.password(), dummyUser.getPassword()))
				.thenReturn(true);
		Mockito.when(jwtService.generateToken(any(User.class))).thenReturn("mock-token");

		AuthenticationResponse response = userService.loginUser(request);

		assertNotNull(response);
		assertNotNull(response.token());
		assertEquals("mock-token", response.token());
		assertEquals("achille@solstice.com", response.user().email());
	}

	@Test
	void loginUserShouldThrowExceptionWhenEmailNotFound() {
		LoginRequest request = new LoginRequest("ghost@solstice.com", "password123");
		Mockito.when(userRepository.findByEmail(request.email()))
				.thenReturn(Optional.empty());

		assertThrows(InvalidCredentialsException.class,
				() -> userService.loginUser(request));
	}

	@Test
	void loginUserShouldThrowExceptionWhenPasswordIsWrong() {
		LoginRequest request = new LoginRequest("achille@solstice.com", "wrongpassword");
		User dummyUser = User.builder().email("achille@solstice.com")
				.password("hashed_password").build();

		Mockito.when(userRepository.findByEmail(request.email()))
				.thenReturn(Optional.of(dummyUser));
		Mockito.when(passwordEncoder.matches(request.password(), dummyUser.getPassword()))
				.thenReturn(false);

		assertThrows(InvalidCredentialsException.class,
				() -> userService.loginUser(request));
	}
}