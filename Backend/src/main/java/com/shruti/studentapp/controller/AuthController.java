package com.shruti.studentapp.controller;

import com.shruti.studentapp.dto.LoginRequest;
import com.shruti.studentapp.dto.RegisterRequest;
import com.shruti.studentapp.service.AuthService;
import org.springframework.web.bind.annotation.*;
import com.shruti.studentapp.dto.LoginResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request){
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        return authService.login(request);
    }
}