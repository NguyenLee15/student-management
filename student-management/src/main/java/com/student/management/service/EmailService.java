// cSpell:disable
package com.student.management.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject("EduPortal - Đặt lại mật khẩu");
            
            String html = "<html><body>" +
                "<h2>Yêu cầu đặt lại mật khẩu</h2>" +
                "<p>Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu trên hệ thống EduPortal.</p>" +
                "<p>Vui lòng click vào link bên dưới để đặt lại mật khẩu (có hiệu lực trong 15 phút):</p>" +
                "<p><a href='" + resetLink + "'><strong>ĐẶT LẠI MẬT KHẨU</strong></a></p>" +
                "<p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>" +
                "</body></html>";
                
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Password reset email sent to {}", to);
        } catch (Exception e) {
            log.error("Lỗi khi gửi email đặt lại mật khẩu đến {}: {}", to, e.getMessage());
        }
    }
}

