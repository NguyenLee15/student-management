package com.student.management.config;

import com.student.management.entity.User;
import com.student.management.enums.Role;
import com.student.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Component
@Profile("!dev")
@RequiredArgsConstructor
public class AdminBootstrapService implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminBootstrapService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin.username:}")
    private String bootstrapUsername;

    @Value("${app.bootstrap.admin.password:}")
    private String bootstrapPassword;

    @Override
    @Transactional
    public void run(String... args) {
        if (!StringUtils.hasText(bootstrapUsername) || !StringUtils.hasText(bootstrapPassword)) {
            logger.info("ℹ️ No INITIAL_ADMIN_USERNAME / INITIAL_ADMIN_PASSWORD provided for bootstrap. Skipping initial admin creation.");
            return;
        }

        if (userRepository.findByUserName(bootstrapUsername).isEmpty()) {
            User admin = User.builder()
                    .userName(bootstrapUsername)
                    .password(passwordEncoder.encode(bootstrapPassword))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            logger.info("🛡️ Initial Production Admin account created successfully for user: [{}]. Please change the password immediately!", bootstrapUsername);
        } else {
            logger.info("🛡️ Admin user [{}] already exists. Skipping bootstrap.", bootstrapUsername);
        }
    }
}
