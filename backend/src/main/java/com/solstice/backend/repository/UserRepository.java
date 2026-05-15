package com.solstice.backend.repository;

import com.solstice.backend.entity.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, UUID> {
  Optional<User> findByEmail(String email);

  @Query(
    "SELECT u FROM User u WHERE u.email = :identifier OR u.handle = :identifier"
  )
  Optional<User> findByIdentifier(@Param("identifier") String identifier);

  Optional<User> findByHandle(String handle);

  boolean existsByEmail(String email);

  boolean existsByHandle(String handle);
}
