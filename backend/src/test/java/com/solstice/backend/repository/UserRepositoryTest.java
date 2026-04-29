package com.solstice.backend.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.solstice.backend.entity.Role;
import com.solstice.backend.entity.User;
import java.util.Optional;
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
class UserRepositoryTest {

  @Container
  @ServiceConnection
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

	@Autowired
	private UserRepository userRepository;

	@Test
	void shouldSaveAndFindUserByEmail() {
		String testEmail = "test.integration@solstice.com";
		User user = User.builder().email(testEmail).password("dummy_hashed_password")
				.role(Role.USER).build();

		userRepository.save(user);
		Optional<User> foundUser = userRepository.findByEmail(testEmail);

		assertTrue(foundUser.isPresent(), "The user should be found in the database");
		assertEquals(testEmail, foundUser.get().getEmail(), "The emails should match");
		assertNotNull(foundUser.get().getId(), "PostgreSQL should have generated a UUID");
		assertNotNull(foundUser.get().getCreatedAt(),
				"PostgreSQL should have generated a creation timestamp");
	}
}