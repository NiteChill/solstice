package com.solstice.backend.service;

import com.ip2location.IP2Location;
import com.ip2location.IPResult;
import java.io.InputStream;
import org.springframework.stereotype.Service;

@Service
public class GeoIpService {

  private final IP2Location ip2Location;

  public GeoIpService() throws Exception {
    ip2Location = new IP2Location();
    try (
      InputStream is = getClass().getResourceAsStream(
        "/IP2LOCATION-LITE-DB3.BIN"
      )
    ) {
      if (is != null) {
        byte[] dbBytes = is.readAllBytes();
        ip2Location.Open(dbBytes);
      } else {
        throw new RuntimeException("Could not find IP2Location DB file");
      }
    }
  }

  public String getLocation(String ipAddress) {
    try {
      IPResult result = ip2Location.IPQuery(ipAddress);
      if ("OK".equals(result.getStatus())) {
        String city = result.getCity();
        String country = result.getCountryLong();
        if (!"-".equals(city) && !"-".equals(country)) {
          return city + ", " + country;
        } else if (!"-".equals(country)) {
          return country;
        }
      }
      return "Unknown Location";
    } catch (Exception e) {
      return "Unknown Location";
    }
  }
}
