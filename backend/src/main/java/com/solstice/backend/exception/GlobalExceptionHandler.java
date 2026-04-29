package com.solstice.backend.exception;

import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(EmailAlreadyTakenException.class)
	public ProblemDetail handleEmailAlreadyTaken(EmailAlreadyTakenException ex) {
		ProblemDetail problemDetail = ProblemDetail
				.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
		problemDetail.setTitle("Account Creation Failed");
		return problemDetail;
	}

	@ExceptionHandler(Exception.class)
	public ProblemDetail handleGenericException(Exception ex) {
		System.out.println("ERROR: " + ex);
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
				HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected server error occurred.");
		problemDetail.setTitle("Internal Server Error");
		problemDetail.setProperty("timestamp", Instant.now());
		return problemDetail;
	}
}
