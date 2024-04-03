package com.hcc.controllers;

import com.hcc.dto.AuthCredentialRequest;
import com.hcc.dto.LoginResponseDto;
import com.hcc.dto.RegisterUserRequestDto;
import com.hcc.dto.ValidateTokenRequest;
import com.hcc.entities.User;
import com.hcc.repositories.UserRepository;
import com.hcc.services.AuthService;
import com.hcc.utils.CustomPasswordEncoder;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/auth")
@AllArgsConstructor
@CrossOrigin(origins = "http://mrs-pattersons-desk-front-end.s3-website.us-east-2.amazonaws.com")
public class AuthController {

    private final CustomPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AuthService authService;
    @PostMapping(path = "/login", produces = "application/json")
    public LoginResponseDto login(@RequestBody AuthCredentialRequest request) {
        String token = authService.login(request);
        return new LoginResponseDto(token);
    }

//    @PostMapping(path = "/register")
//    public User createUser(@RequestBody RegisterUserRequestDto body) {
//        return authService.registerUser(body);
//    }

    @PostMapping(path = "/validate")
    public boolean validateToken(@RequestBody ValidateTokenRequest request) {
        return authService.validateToken(request.getToken());
    }
}
