package com.chedtech.api.modules.auth.controller;

import com.chedtech.api.common.response.ApiResponse;
import com.chedtech.api.modules.auth.dto.AuthResponse;
import com.chedtech.api.modules.auth.dto.LoginRequest;
import com.chedtech.api.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ApiResponse.ok(response, "Login successful");
    }
}

