package group15.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@inventory.com");
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click the link below:\n\n" +
                "http://localhost:3000/reset-password?token=" + token + "\n\n" +
                "If you did not request a password reset, please ignore this email.");
        
        // Log the email details for development
        logger.info("=====================================");
        logger.info("Password Reset Email Details:");
        logger.info("To: {}", to);
        logger.info("Reset Token: {}", token);
        logger.info("Reset Link: http://localhost:3000/reset-password?token={}", token);
        logger.info("=====================================");
    }
} 