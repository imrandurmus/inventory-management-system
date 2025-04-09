package group15.backend.controller;

import group15.backend.dto.SignupRequest;
import group15.backend.model.Employee;
import group15.backend.repository.EmployeeRepository;
import group15.backend.security.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            // Generate JWT
            String token = jwtUtil.generateToken(email);

            // Optionally: Include role or name in response
            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", employee.getRole().name(),
                    "fullName", employee.getFirstName() + " " + employee.getLastName()
            ));

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        if (employeeRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already in use.");
        }

        // Restrict manager signup to @company.com emails
        if (req.getRole() == group15.backend.model.Role.MANAGER &&
                !req.getEmail().endsWith("@company.com")) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Only internal emails can register as MANAGER.");
        }

        Employee newEmployee = new Employee();
        newEmployee.setFirstName(req.getFirstName());
        newEmployee.setLastName(req.getLastName());
        newEmployee.setEmail(req.getEmail());
        newEmployee.setPassword(passwordEncoder.encode(req.getPassword()));
        newEmployee.setProfileImageUrl(req.getProfileImageUrl());

        newEmployee.setRole(
                req.getRole() != null ? req.getRole() : group15.backend.model.Role.REGULAR
        );

        employeeRepository.save(newEmployee);

        return ResponseEntity.status(HttpStatus.CREATED).body("Signup successful!");
    }

}
