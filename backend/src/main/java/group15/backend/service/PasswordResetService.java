package group15.backend.service;

import group15.backend.model.Employee;
import group15.backend.repository.EmployeeRepository;
import group15.backend.security.jwt.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PasswordResetService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public PasswordResetService(EmployeeRepository employeeRepository,
                              PasswordEncoder passwordEncoder,
                              EmailService emailService,
                              JwtUtil jwtUtil) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    public void initiatePasswordReset(String email) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate a reset token
        String resetToken = UUID.randomUUID().toString();
        
        // Send reset email
        emailService.sendPasswordResetEmail(email, resetToken);
    }

    public void resetPassword(String token, String newPassword) {
        // In a real application, you would validate the token against a stored token
        // For this example, we'll use the token as the email
        String email = token; // This is simplified - in production, use proper token validation
        
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        // Update password
        employee.setPassword(passwordEncoder.encode(newPassword));
        employeeRepository.save(employee);
    }
} 