package com.example.student.management.config;

import com.example.student.management.entity.User;
import com.example.student.management.enums.Role;
import com.example.student.management.repository.User_Repository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private User_Repository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUserName("admin").isEmpty()) {
            User admin = new User();
            admin.setUserName("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            logger.info("Initialized default ADMIN user (username: admin, password: admin123)");
        }

        if (userRepository.findByUserName("teacher").isEmpty()) {
            User teacher = new User();
            teacher.setUserName("teacher");
            teacher.setPassword(passwordEncoder.encode("teacher123"));
            teacher.setRole(Role.TEACHER);
            userRepository.save(teacher);
            logger.info("Initialized default TEACHER user (username: teacher, password: teacher123)");
        }
    }
}
