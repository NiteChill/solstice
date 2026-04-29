package com.solstice.backend.controller;

import com.solstice.backend.dto.AuthenticationResponse;
import com.solstice.backend.dto.LoginRequest;
import com.solstice.backend.dto.RegisterRequest;
import com.solstice.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UserService userService;

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public AuthenticationResponse register(@RequestBody RegisterRequest request) {
		return userService.registerUser(request);
	}

	@PostMapping("/login")
	@ResponseStatus(HttpStatus.OK)
	public AuthenticationResponse login(@RequestBody LoginRequest request) {
		return userService.loginUser(request);
	}
}