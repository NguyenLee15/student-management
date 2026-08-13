package com.student.management.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.secret}")
    private String secretKeyString;

    @Value("${jwt.expiration:86400000}") // Mặc định 1 ngày
    private long validityInMilliseconds;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        // Khởi tạo khóa bí mật từ chuỗi secretKeyString
        this.secretKey = Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
        logger.info("JWT secret key initialized successfully");
    }

    public String generateToken(String username, String role, String studentId) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        logger.debug("Generating JWT for username: {}, role: {}", username, role);

        return Jwts.builder()
            .setSubject(username)
            .claim("role", role)
            .claim("studentId", studentId)
            .setIssuedAt(now)
            .setExpiration(validity)
            .signWith(secretKey, io.jsonwebtoken.SignatureAlgorithm.HS512)
            .compact();
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = parseClaims(token);
        return claims.getSubject();
    }

    public String getRoleFromJWT(String token) {
        Claims claims = parseClaims(token);
        return claims.get("role", String.class);
    }

    public String getStudentIdFromJWT(String token) {
        Claims claims = parseClaims(token);
        return claims.get("studentId", String.class);
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            logger.debug("JWT token validated successfully");
            return true;
        } catch (ExpiredJwtException e) {
            logger.error("JWT token expired: {}", e.getMessage());
            throw new RuntimeException("Token has expired", e);
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
            throw new RuntimeException("Invalid token signature", e);
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
            throw new RuntimeException("Invalid token format", e);
        } catch (Exception e) {
            logger.error("JWT validation failed: {}", e.getMessage());
            throw new RuntimeException("Token validation failed", e);
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
