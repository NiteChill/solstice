package com.solstice.backend.config;

import nl.basjes.parse.useragent.UserAgentAnalyzer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class YauaaConfig {

  @Bean
  public UserAgentAnalyzer userAgentAnalyzer() {
    return UserAgentAnalyzer.newBuilder()
      .hideMatcherLoadStats()
      .withCache(10000)
      .withField("AgentName")
      .withField("OperatingSystemName")
      .withField("DeviceClass")
      .build();
  }
}
