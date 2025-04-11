package group15.backend.controller;

import group15.backend.dto.PasswordResetConfirmation;
import group15.backend.dto.PasswordResetRequest;
import group15.backend.dto.SignupRequest;
import group15.backend.model.Employee;
import group15.backend.model.Role;
import group15.backend.repository.EmployeeRepository;
import group15.backend.security.jwt.JwtUtil;
import group15.backend.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Fetch the Employee object
            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // Generate JWT with Employee object
            String token = jwtUtil.generateToken(employee);

            return ResponseEntity.ok(Map.of("token", token));

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        // Check if email is already used
        if (employeeRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email is already registered."));
        }

        // Create new employee
        Employee newEmployee = new Employee();
        newEmployee.setFirstName(req.getFirstName());
        newEmployee.setLastName(req.getLastName());
        newEmployee.setEmail(req.getEmail());
        newEmployee.setPassword(passwordEncoder.encode(req.getPassword())); // Hash the password
        newEmployee.setRole(Role.MANAGER); // Hardcoded as MANAGER for now

        // Default profile image if none is provided
        if (req.getProfileImageUrl() == null || req.getProfileImageUrl().isBlank()) {
            String initialsUrl = "https://ui-avatars.com/api/?name=" +
                    URLEncoder.encode(req.getFirstName() + " " + req.getLastName(), StandardCharsets.UTF_8);
            newEmployee.setProfileImageUrl(initialsUrl);
        } else {
            newEmployee.setProfileImageUrl(req.getProfileImageUrl());
        }

        // Save to database
        employeeRepository.save(newEmployee);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Signup successful!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody PasswordResetRequest request) {
        try {
            passwordResetService.initiatePasswordReset(request.getEmail());
            return ResponseEntity.ok(Map.of("message", "Password reset email sent"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody PasswordResetConfirmation request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password reset successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}