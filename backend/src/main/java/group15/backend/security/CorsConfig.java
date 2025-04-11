package group15.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Define allowed origins (frontend ports)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",  // React dev port
                "http://localhost:5173",  // Vite port 1
                "http://localhost:5174",  // Vite port 2
                "http://localhost:5175"   // Vite port 3
        ));

        // Define allowed HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Define allowed headers (Content-Type, Authorization)
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));

        // Allow credentials (JWT tokens, cookies)
        configuration.setAllowCredentials(true);

        // Apply the CORS configuration for all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        configuration.setAllowedHeaders(Arrays.asList("*"));
        return source;
    }
}
