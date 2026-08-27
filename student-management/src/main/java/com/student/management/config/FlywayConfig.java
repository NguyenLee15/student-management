package com.student.management.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.flywaydb.core.Flyway;

@Configuration
public class FlywayConfig {

    @Bean
    @Profile("dev")
    public FlywayMigrationStrategy repairStrategy() {
        return flyway -> {
            flyway.repair();
            flyway.migrate();
        };
    }

    @Bean
    @Profile("!dev")
    public FlywayMigrationStrategy prodStrategy() {
        return Flyway::migrate;
    }
}

