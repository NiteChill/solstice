package com.solstice.backend.repository;

import com.solstice.backend.entity.RefreshToken;
import com.solstice.backend.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
  Optional<RefreshToken> findByToken(String token);

  Optional<RefreshToken> findByUserAndUserAgentAndIpAddress(User user, String userAgent, String ipAddress);

  List<RefreshToken> findAllByUser(User user);

  void deleteAllByUser(User user);

  void deleteByToken(String token);
}