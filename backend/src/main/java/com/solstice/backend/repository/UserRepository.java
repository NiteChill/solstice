package com.solstice.backend.repository;

import com.solstice.backend.entity.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, UUID> {

  Optional<User> findByEmail(String email);

  @Query("SELECT u FROM User u WHERE u.email = :username OR u.handle = :username")
  Optional<User> findByUsername(@Param("username") String username);

  boolean existsByEmail(String email);

  boolean existsByHandle(String handle);
}
