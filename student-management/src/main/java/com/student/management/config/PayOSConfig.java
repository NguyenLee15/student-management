package com.student.management.config;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

@Slf4j
@Configuration
@Getter
public class PayOSConfig {

    @Value("${payos.client-id:}")
    private String clientId;

    @Value("${payos.api-key:}")
    private String apiKey;

    @Value("${payos.checksum-key:}")
    private String checksumKey;

    public boolean isConfigured() {
        return StringUtils.hasText(clientId) && StringUtils.hasText(apiKey) && StringUtils.hasText(checksumKey);
    }

    @Bean
    public RestClient payOSRestClient() {
        return RestClient.builder()
                .baseUrl("https://api-merchant.payos.vn")
                .build();
    }
}

