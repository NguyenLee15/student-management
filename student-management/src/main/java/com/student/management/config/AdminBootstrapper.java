package com.student.management.config;

import com.student.management.entity.User;
import com.student.management.enums.Role;
import com.student.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class AdminBootstrapper implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminBootstrapper.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin.username:}")
    private String adminUsername;

    @Value("${app.bootstrap.admin.password:}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {
        if (!StringUtils.hasText(adminUsername) || !StringUtils.hasText(adminPassword)) {
            logger.info("Admin bootstrap credentials not provided. Skipping admin bootstrap.");
            return;
        }

        if (userRepository.findByUserName(adminUsername).isEmpty()) {
            User admin = User.builder()
                    .userName(adminUsername)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            logger.info("Successfully bootstrapped initial admin user: {}", adminUsername);
        } else {
            logger.info("Admin user '{}' already exists. Skipping bootstrap.", adminUsername);
        }
    }
}

