package com.ies.tour.visitasvirtuales_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Habilita la seguridad web de Spring
public class SecurityConfig {

    // Define las reglas de acceso (rutas que estan protegidas)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilita CSRF (Necesario para APIs REST)
                .httpBasic(httpBasic -> httpBasic.disable()) // Deshabilita la autenticación básica de HTTP por defecto
                .authorizeHttpRequests(authorize -> authorize
                        // Permite el acceso sin autenticación a los endpoints de autenticación
                        .requestMatchers("/api/auth/**").permitAll()
                        // Todas las demas peticiones requieren autenticación
                        .anyRequest().authenticated());

        // Por ahora se abren las rutas auth
        // Usaremos JWT después
        return http.build();

    }

    // Hace falta mas adelante
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

}
