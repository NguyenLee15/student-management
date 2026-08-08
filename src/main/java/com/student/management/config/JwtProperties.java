package com.student.management.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
// Đăng kí class này làm bean trong spring container để nó tự động được quản lý (inject vào nơi khác được)
@ConfigurationProperties(prefix = "jwt")
// dùng để map các property từ cấu hình vào classclass
@EnableConfigurationProperties(JwtProperties.class)

public class JwtProperties {

    private String secret;
    private long expirationMs;

    // Getters and Setters
    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    public void setExpirationMs(long expirationMs) {
        this.expirationMs = expirationMs;
    }
}

