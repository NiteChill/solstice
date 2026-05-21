package com.solstice.backend.service;

import com.solstice.backend.dto.UserResponse;
import com.solstice.backend.entity.User;
import com.solstice.backend.repository.UserRepository;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

  private final UserRepository userRepository;

  @Transactional
  public UserResponse uploadAvatar(
    User user,
    com.solstice.backend.dto.UpdateAvatarRequest request
  ) throws IOException {
    Path uploadDir = Paths.get("uploads", "avatars")
      .toAbsolutePath()
      .normalize();
    if (!Files.exists(uploadDir)) {
      Files.createDirectories(uploadDir);
    }

    String newFilename = UUID.randomUUID().toString();
    File originalWebpFile = uploadDir.resolve(newFilename + ".webp").toFile();
    File thumbWebpFile = uploadDir
      .resolve(newFilename + "_thumb.webp")
      .toFile();

    Thumbnails.of(request.file().getInputStream())
      .size(512, 512)
      .crop(Positions.CENTER)
      .outputFormat("webp")
      .toFile(originalWebpFile);

    Thumbnails.of(originalWebpFile)
      .size(128, 128)
      .outputFormat("webp")
      .toFile(thumbWebpFile);

    String oldProfilePicture = user.getProfilePicture();
    if (
      oldProfilePicture != null && oldProfilePicture.startsWith("/avatars/")
    ) {
      String oldFilename = oldProfilePicture.substring("/avatars/".length());
      try {
        Files.deleteIfExists(uploadDir.resolve(oldFilename + ".webp"));
        Files.deleteIfExists(uploadDir.resolve(oldFilename + "_thumb.webp"));
      } catch (IOException e) {
        e.printStackTrace();
      }
    }

    user.setProfilePicture("/avatars/" + newFilename);
    User updatedUser = userRepository.save(user);

    return UserResponse.fromEntity(updatedUser);
  }

  @Transactional
  public UserResponse deleteAvatar(User user) {
    String oldProfilePicture = user.getProfilePicture();
    if (
      oldProfilePicture != null && oldProfilePicture.startsWith("/avatars/")
    ) {
      String oldFilename = oldProfilePicture.substring("/avatars/".length());
      Path uploadDir = Paths.get("uploads", "avatars")
        .toAbsolutePath()
        .normalize();
      try {
        Files.deleteIfExists(uploadDir.resolve(oldFilename + ".webp"));
        Files.deleteIfExists(uploadDir.resolve(oldFilename + "_thumb.webp"));
      } catch (IOException e) {
        e.printStackTrace();
      }
    }

    user.setProfilePicture(null);
    User updatedUser = userRepository.save(user);

    return UserResponse.fromEntity(updatedUser);
  }
}
