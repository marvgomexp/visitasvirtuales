package com.ies.tour.visitasvirtuales_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.ies.tour.visitasvirtuales_backend.security.jwt.AuthEntryPointJwt;
import com.ies.tour.visitasvirtuales_backend.security.jwt.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity // Habilita la seguridad web de Spring
public class SecurityConfig {

        @Autowired
        private JwtAuthenticationFilter jwtAuthenticationFilter;

        @Autowired
        private AuthEntryPointJwt unauthorizedHandler;

        // 1. Define las reglas de acceso e integra JWT
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable()) // Deshabilita CSRF
                                .httpBasic(httpBasic -> httpBasic.disable()) // Deshabilita la autenticación básica de
                                                                             // HTTP por defecto

                                // Configuración de manejo de errores 401 (No Autorizado)
                                .exceptionHandling(exception -> exception
                                                .authenticationEntryPoint(unauthorizedHandler))

                                // Configuración de la gestión de sesiones como SIN ESTADO (STATELESS)
                                // Necesario para JWT, ya que el token contiene el estado de autenticación.
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                // Autorización de peticiones
                                .authorizeHttpRequests(authorize -> authorize
                                                // Rutas públicas: login y registro
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers("/api/visitas/**").permitAll() // TEMPORAL
                                                // Todas las demás peticiones necesitan autenticación (incluye GET)
                                                .anyRequest().authenticated());

                // 2. AÑADIR EL FILTRO JWT
                // Ejecuta el filtro de validación de token ANTES de que Spring Security intente
                // verificar la sesión o el usuario/contraseña.
                http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        // 3. Bean para obtener el AuthenticationManager (necesario en AuthController)
        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
                        throws Exception {
                return authenticationConfiguration.getAuthenticationManager();
        }

}