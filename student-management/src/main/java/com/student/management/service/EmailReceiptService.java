package com.student.management.service;

import com.student.management.entity.PaymentTransaction;
import com.student.management.entity.Student;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Slf4j
@Service
public class EmailReceiptService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailSenderUsername;

    @Async
    public void sendPaymentReceipt(Student student, PaymentTransaction transaction) {
        if (mailSender == null || !StringUtils.hasText(mailSenderUsername)) {
            log.info("📧 Email service unconfigured (mailSender is null or MAIL_USERNAME empty). Skipping receipt email for student: {}", student.getStudentId());
            return;
        }

        String recipientEmail = student.getEmail();
        if (!StringUtils.hasText(recipientEmail)) {
            log.warn("⚠️ Student {} does not have an email address configured. Skipping receipt.", student.getStudentId());
            return;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(mailSenderUsername, "Phòng Đào Tạo & Kế Toán EduPortal");
            helper.setTo(recipientEmail);
            helper.setSubject("✅ Biên lai xác nhận thanh toán học phí thành công - Mã GD: " + transaction.getOrderCode());

            NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(Locale.of("vi", "VN"));
            String formattedAmount = currencyFormat.format(transaction.getAmount());
            String paidTimeStr = transaction.getPaidAt() != null 
                    ? transaction.getPaidAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))
                    : "Vừa xong";

            String htmlBody = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #334155; }
                        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                        .header { background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 30px 20px; text-align: center; color: #ffffff; }
                        .content { padding: 30px; }
                        .table { width: 100%%; border-collapse: collapse; margin-top: 20px; }
                        .table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
                        .table td.label { color: #64748b; font-weight: 500; }
                        .table td.value { font-weight: 600; text-align: right; color: #0f172a; }
                        .highlight { font-size: 18px; color: #16a34a !important; }
                        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div class="header">
                            <h2 style="margin: 0; font-size: 22px;">EduPortal - Đại học</h2>
                            <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Biên lai xác nhận thanh toán học phí trực tuyến</p>
                        </div>
                        <div class="content">
                            <p>Xin chào <strong>%s</strong> (Mã SV: <strong>%s</strong>),</p>
                            <p>Hệ thống EduPortal xác nhận bạn đã thanh toán học phí thành công thông qua cổng thanh toán <strong>PayOS (VietQR)</strong>.</p>
                            
                            <table class="table">
                                <tr>
                                    <td class="label">Mã giao dịch PayOS:</td>
                                    <td class="value">#%d</td>
                                </tr>
                                <tr>
                                    <td class="label">Mã hóa đơn học kỳ:</td>
                                    <td class="value">%s</td>
                                </tr>
                                <tr>
                                    <td class="label">Số tiền đã thanh toán:</td>
                                    <td class="value highlight">%s</td>
                                </tr>
                                <tr>
                                    <td class="label">Thời gian giao dịch:</td>
                                    <td class="value">%s</td>
                                </tr>
                                <tr>
                                    <td class="label">Trạng thái:</td>
                                    <td class="value" style="color: #16a34a;">ĐÃ HOÀN TẤT</td>
                                </tr>
                            </table>
                            <p style="margin-top: 25px; font-size: 13px; color: #64748b;">
                                Công nợ của bạn đã được cập nhật tự động trên Cổng thông tin sinh viên EduPortal.
                            </p>
                        </div>
                        <div class="footer">
                            Email này được gửi tự động từ hệ thống Quản lý Đào tạo EduPortal.<br>
                            Vui lòng không phản hồi trực tiếp vào địa chỉ email này.
                        </div>
                    </div>
                </body>
                </html>
                """,
                student.getFullName(),
                student.getStudentId(),
                transaction.getOrderCode(),
                transaction.getInvoice().getInvoiceCode(),
                formattedAmount,
                paidTimeStr
            );

            helper.setText(htmlBody, true);
            mailSender.send(mimeMessage);
            log.info("✅ Payment receipt email successfully sent to student: {} [{}]", student.getStudentId(), recipientEmail);
        } catch (Exception e) {
            log.error("❌ Failed to send receipt email to student: {} - {}", student.getStudentId(), e.getMessage());
        }
    }
}

