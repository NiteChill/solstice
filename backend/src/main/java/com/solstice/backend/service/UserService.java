package com.solstice.backend.service;

import com.solstice.backend.dto.LoginRequest;
import com.solstice.backend.dto.RegisterRequest;
import com.solstice.backend.dto.UserResponse;
import com.solstice.backend.entity.Role;
import com.solstice.backend.entity.User;
import com.solstice.backend.exception.EmailAlreadyTakenException;
import com.solstice.backend.exception.InvalidCredentialsException;
import com.solstice.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Transactional
	public UserResponse registerUser(RegisterRequest request) {
		if (userRepository.findByEmail(request.email()).isPresent()) {
			throw new EmailAlreadyTakenException(
					"Email is already registered: " + request.email());
		}

		User user = User.builder().email(request.email())
				.password(passwordEncoder.encode(request.password())).role(Role.USER)
				.build();

		User savedUser = userRepository.save(user);

		return UserResponse.fromEntity(savedUser);
	}

	@Transactional(readOnly = true)
	public UserResponse loginUser(LoginRequest request) {
		User user = userRepository.findByEmail(request.email()).orElseThrow(
				() -> new InvalidCredentialsException("Invalid email or password"));

		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new InvalidCredentialsException("Invalid email or password");
		}

		return UserResponse.fromEntity(user);
	}
}