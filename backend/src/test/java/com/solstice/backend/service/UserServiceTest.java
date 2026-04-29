package com.solstice.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

import com.solstice.backend.dto.RegisterRequest;
import com.solstice.backend.dto.UserResponse;
import com.solstice.backend.entity.Role;
import com.solstice.backend.entity.User;
import com.solstice.backend.exception.EmailAlreadyTakenException;
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

		UserResponse response = userService.registerUser(request);

		assertNotNull(response);
		assertEquals(fakeId, response.id());
		assertEquals(request.email(), response.email());
		assertEquals("USER", response.role());

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
}