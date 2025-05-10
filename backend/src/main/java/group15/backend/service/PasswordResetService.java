package group15.backend.service;

import group15.backend.model.Employee;
import group15.backend.repository.EmployeeRepository;
import group15.backend.model.PasswordResetToken;
import group15.backend.repository.PasswordResetTokenRepository;
import group15.backend.security.jwt.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;


import java.util.UUID;
@Service
public class PasswordResetService {

    private final EmployeeRepository employeeRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PasswordResetService(EmployeeRepository employeeRepository,
                                PasswordResetTokenRepository tokenRepository,
                                PasswordEncoder passwordEncoder,
                                EmailService emailService) {
        this.employeeRepository = employeeRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public void initiatePasswordReset(String email) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        tokenRepository.findByEmployee(employee).ifPresent(tokenRepository::delete);

        String resetToken = UUID.randomUUID().toString();

        PasswordResetToken token = new PasswordResetToken();
        token.setToken(resetToken);
        token.setEmployee(employee);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(15));

        tokenRepository.save(token);

        emailService.sendPasswordResetEmail(email, resetToken);
    }


    public void resetPassword(String tokenStr, String newPassword) {
        PasswordResetToken token = tokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        Employee employee = token.getEmployee();
        employee.setPassword(passwordEncoder.encode(newPassword));
        employeeRepository.save(employee);

        tokenRepository.delete(token); // Invalidate token after use
    }
}
