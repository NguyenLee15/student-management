package com.student.management.service;

import com.student.management.entity.RefreshToken;
import com.student.management.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RefreshTokenService {

    @Value("${jwt.refresh-expiration:604800000}") // 7 days in ms
    private long refreshExpirationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    public RefreshToken createRefreshToken(String userName) {
        // Revoke existing tokens for user to ensure single active session (optional, but good practice)
        revokeByUserName(userName);

        RefreshToken refreshToken = RefreshToken.builder()
                .userName(userName)
                .expiryDate(LocalDateTime.now().plusNanos(refreshExpirationMs * 1000000))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshTokenRepository::delete);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        if (token.isRevoked()) {
            throw new RuntimeException("Refresh token was revoked. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public void revokeByUserName(String userName) {
        List<RefreshToken> activeTokens = refreshTokenRepository.findByUserNameAndRevokedFalse(userName);
        for (RefreshToken token : activeTokens) {
            token.setRevoked(true);
        }
        refreshTokenRepository.saveAll(activeTokens);
    }
}

