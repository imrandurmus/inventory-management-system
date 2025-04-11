package group15.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        // Configure for local testing (no real emails will be sent)
        mailSender.setHost("localhost");
        mailSender.setPort(25);
        mailSender.setUsername("test");
        mailSender.setPassword("test");
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "false"); // No authentication needed for local testing
        props.put("mail.smtp.starttls.enable", "false");
        props.put("mail.debug", "true");
        
        return mailSender;
    }
} 