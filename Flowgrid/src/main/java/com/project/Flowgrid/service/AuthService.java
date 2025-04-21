package com.project.Flowgrid.service;

import com.project.Flowgrid.domain.User;
import com.project.Flowgrid.dto.AuthRequest;
import com.project.Flowgrid.dto.AuthResponse;
import com.project.Flowgrid.dto.UserCreateRequest;
import com.project.Flowgrid.dto.UserDTO;
import com.project.Flowgrid.exception.ResourceNotFoundException;
import com.project.Flowgrid.mapper.UserMapper;
import com.project.Flowgrid.repository.UserRepository;
import com.project.Flowgrid.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final UserMapper userMapper;
    
    // Store blacklisted tokens - in production, use Redis or a database
    private final Set<String> tokenBlacklist = ConcurrentHashMap.newKeySet();

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + request.getUsername()));

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .user(userMapper.toDTO(user))
                .build();
    }

    @Transactional
    public UserDTO createUser(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + request.getUsername());
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

    public AuthResponse refreshToken(String refreshToken) {
        // Check if token is blacklisted
        if (tokenBlacklist.contains(refreshToken)) {
            throw new IllegalArgumentException("Refresh token has been used or revoked");
        }
        
        String username = jwtUtil.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (jwtUtil.validateToken(refreshToken, userDetails)) {
            // Add the used refresh token to the blacklist
            tokenBlacklist.add(refreshToken);
            
            String newAccessToken = jwtUtil.generateToken(userDetails);
            String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);
            
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

            return AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .tokenType("Bearer")
                    .expiresIn(86400000L)
                    .user(userMapper.toDTO(user))
                    .build();
        }

        throw new IllegalArgumentException("Invalid refresh token");
    }
    
    // For logout functionality
    public void revokeToken(String token) {
        if (token != null && !token.isEmpty()) {
            tokenBlacklist.add(token);
        }
    }
} 
