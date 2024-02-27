package com.hcc.controllers;

import com.hcc.dto.AuthCredentialRequest;
import com.hcc.dto.RegisterUserRequestDto;
import com.hcc.dto.ValidateTokenRequest;
import com.hcc.entities.User;
import com.hcc.repositories.UserRepository;
import com.hcc.services.AuthService;
import com.hcc.utils.CustomPasswordEncoder;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/auth")
@AllArgsConstructor
public class AuthController {

    private final CustomPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AuthService authService;

    @PostMapping(path = "/login")
    public String login(@RequestBody AuthCredentialRequest request) {
        return authService.login(request);
    }

    @PostMapping(path = "/register")
    public User createUser(@RequestBody RegisterUserRequestDto body) {
        return authService.registerUser(body);
    }

    @PostMapping(path = "/validate")
    public boolean validateToken(@RequestBody ValidateTokenRequest request) {
        return authService.validateToken(request.getToken());
    }
}
