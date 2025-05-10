package group15.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    static {
        // Force JavaMail to enable SMTP debug logging
        System.setProperty("mail.debug", "true");
    }

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click the link below:\n\n" +
                "http://simple.local:5173/reset-password?token=" + token + "\n\n" +
               "If you did not request a password reset, please ignore this email.");
        //message.setText("This is a test message from the backend.");
        // In development mode, just log the token instead of sending an email
        logger.info("Password reset token for {}: {}", to, token);
        logger.info("Reset link: http://localhost:3000/reset-password?token={}", token);

        logger.info("Using mail sender class: {}", mailSender.getClass().getName());


        mailSender.send(message);
    }
} 