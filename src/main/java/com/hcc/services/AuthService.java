package com.hcc.services;

import com.hcc.dto.AuthCredentialRequest;
import com.hcc.dto.RegisterUserRequestDto;
import com.hcc.entities.Assignment;
import com.hcc.entities.Authority;
import com.hcc.entities.User;
import com.hcc.enums.AssignmentEnum;
import com.hcc.enums.AssignmentStatusEnum;
import com.hcc.enums.AuthorityEnum;
import com.hcc.exceptions.InvalidUsernameOrPasswordException;
import com.hcc.repositories.AssignmentRepository;
import com.hcc.repositories.UserRepository;
import com.hcc.utils.CustomPasswordEncoder;
import com.hcc.utils.JWTUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.InvalidParameterException;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class AuthService {

    private UserRepository userRepository;
    private final CustomPasswordEncoder passwordEncoder;
    private JWTUtils jwtUtils;
    private AuthenticationManager authenticationManager;
    private final AssignmentRepository assignmentRepository;

    public User registerUser(RegisterUserRequestDto request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new InvalidParameterException("Passwords do not match");
        }

        String encodedPassword = passwordEncoder.getPasswordEncoder().encode(request.getPassword());

        User user = new User();
        user.setCohortStartDate(LocalDate.now());
        user.setUsername(request.getUsername());
        user.setPassword(encodedPassword);

        Authority authority = null;

        if (request.getUsername().equals("reviewer@example.com")) {
            authority = new Authority(AuthorityEnum.ROLE_CODE_REVIEWER.toString(), user);
        } else {
            authority = new Authority(AuthorityEnum.ROLE_LEARNER.toString(), user);
        }

        user.setAuthorities(List.of(authority));

        return userRepository.save(user);
    }

    public String login(AuthCredentialRequest request) {
        try {

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            return jwtUtils.generateToken(auth);

        } catch (AuthenticationException e) {
            throw new InvalidUsernameOrPasswordException("Invalid username or password", e);
        }
    }

    public boolean validateToken(String token) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return jwtUtils.validateToken(token, user);
    }
}
