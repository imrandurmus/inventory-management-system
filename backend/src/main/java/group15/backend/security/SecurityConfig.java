package group15.backend.security;

import group15.backend.security.jwt.JwtAuthenticationFilter;
import group15.backend.security.services.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.security.config.Customizer;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource; // This is injected from your CorsConfig

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource)) // Ensure Spring Security uses your
                                                                                 // custom CORS configuration
                .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless JWT authentication
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless
                                                                                                              // authentication
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/announcements/**").permitAll() // Allow all announcement endpoints
                        .requestMatchers(HttpMethod.GET, "/announcements").permitAll() // Allow GET /announcements
                        .requestMatchers(HttpMethod.POST, "/announcements").permitAll() // Allow POST /announcements
                        .requestMatchers(HttpMethod.GET, "/announcements/{id:\\d+}").permitAll() // Allow GET /announcements/{id}
                        .requestMatchers("/announcements/unread").hasAnyRole("MANAGER", "REGULAR") // Require auth for /unread
                        .requestMatchers("/announcements/**").permitAll() // Catch-all for other announcement endpoints
                        .requestMatchers("/auth/**").permitAll() // Allow public access to login and signup
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll() // Allow public access to products
                        .requestMatchers(HttpMethod.GET, "/product-types/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/products/**").hasAnyRole("MANAGER", "REGULAR")
                        .requestMatchers(HttpMethod.PUT, "/products/**").hasAnyRole("MANAGER", "REGULAR")
                        .requestMatchers(HttpMethod.DELETE, "/products/**").hasAnyRole("MANAGER", "REGULAR")
                        .requestMatchers(HttpMethod.POST, "/product-types/**").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.GET, "/dashboard/**").hasRole("MANAGER") // Only managers can access
                                                                                             // this dashboard
                        .requestMatchers(HttpMethod.PUT, "/employees/**").hasAnyRole("MANAGER", "REGULAR")
                        .requestMatchers(HttpMethod.GET, "/employees/me").hasAnyRole("MANAGER", "REGULAR") // Allow both
                                                                                                           // roles for
                                                                                                           // /me
                        .requestMatchers("/employees/**").hasRole("MANAGER") // Other /employees endpoints for MANAGER
                        .requestMatchers(HttpMethod.GET, "/orders").hasAnyRole("MANAGER", "REGULAR") // Allow both
                                                                                                     // MANAGER and
                                                                                                     // REGULAR to view
                                                                                                     // orders
                        .requestMatchers(HttpMethod.POST, "/orders").hasAnyRole("MANAGER", "REGULAR") // Allow both
                                                                                                      // MANAGER and
                                                                                                      // REGULAR to
                                                                                                      // create orders

                        .requestMatchers("/invoices/**").permitAll() // Allow all invoice endpoints
                        .anyRequest().authenticated() // Secure all other endpoints
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}