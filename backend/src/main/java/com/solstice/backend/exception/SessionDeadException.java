package com.solstice.backend.exception;

public class SessionDeadException extends RuntimeException {
  public SessionDeadException(String message) {
    super(message);
  }
}