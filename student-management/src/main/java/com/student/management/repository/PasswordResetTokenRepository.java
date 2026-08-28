package com.student.management.repository;

import com.student.management.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;


public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByTokenAndUsedFalse(String token);
}

