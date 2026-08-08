package com.student.management.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getServletPath();
        logger.debug("Processing request for path: {}", path);

        // Bỏ qua filter cho /login, /error, /images/*, và /favicon.ico
        if ("/login".equals(path) || path.equals("/error") || path.startsWith("/images/") || path.equals("/favicon.ico")) {
            logger.debug("Skipping JWT filter for path: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = extractJwtFromRequest(request);
        logger.debug("Extracted JWT: {}", jwt != null ? "present" : "null");

        if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (jwtTokenProvider.validateToken(jwt)) {
                    String username = jwtTokenProvider.getUsernameFromJWT(jwt);
                    String role = jwtTokenProvider.getRoleFromJWT(jwt);
                    logger.info("Validated JWT token for username: {}, role: {}", username, role);

                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        username, null, Collections.singletonList(authority));
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    logger.info("Set SecurityContext for user: {}", username);
                } else {
                    logger.warn("Invalid JWT token");
                }
            } catch (Exception e) {
                logger.error("JWT validation failed: {}", e.getMessage());
                SecurityContextHolder.clearContext();
            }
        } else {
            logger.debug("No valid JWT token or authentication already set");
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            logger.debug("Found Authorization Bearer header");
            return bearerToken.substring(7);
        }

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt-token".equals(cookie.getName())) {
                    logger.debug("Found jwt-token cookie");
                    return cookie.getValue();
                }
            }
        }
        logger.debug("No jwt-token header or cookie found");
        return null;
    }
}
