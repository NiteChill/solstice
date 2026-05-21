package com.solstice.backend.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    Path uploadDir = Paths.get("uploads", "avatars")
      .toAbsolutePath()
      .normalize();
    String uploadPath = uploadDir.toString();

    registry
      .addResourceHandler("/avatars/**")
      .addResourceLocations("file:" + uploadPath + "/");
  }
}
