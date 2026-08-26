package com.student.management.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class TelegramAlertService {

    @Value("${telegram.bot.token:}")
    private String botToken;

    @Value("${telegram.bot.chat-id:}")
    private String chatId;

    private final RestClient restClient = RestClient.create();

    @Async
    public void sendAlert(String title, String message, String level) {
        if (!StringUtils.hasText(botToken) || !StringUtils.hasText(chatId)) {
            return;
        }

        try {
            String emoji = "ERROR".equalsIgnoreCase(level) ? "🚨" : ("WARN".equalsIgnoreCase(level) ? "⚠️" : "ℹ️");
            String timeStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            
            String text = String.format("""
                %s *[EduPortal Production Alert]*
                *Level:* `%s`
                *Time:* `%s`
                *Title:* *%s*
                
                %s
                """, emoji, level, timeStr, title, message);

            String url = String.format("https://api.telegram.org/bot%s/sendMessage", botToken);
            
            restClient.post()
                    .uri(url)
                    .body(Map.of(
                            "chat_id", chatId,
                            "text", text,
                            "parse_mode", "Markdown"
                    ))
                    .retrieve()
                    .toBodilessEntity();
            
            log.info("📢 Telegram alert sent successfully: {}", title);
        } catch (Exception e) {
            log.warn("⚠️ Failed to send Telegram alert: {}", e.getMessage());
        }
    }
}

