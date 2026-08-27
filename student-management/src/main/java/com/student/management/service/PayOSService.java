package com.student.management.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.student.management.config.PayOSConfig;
import com.student.management.dto.req.CreatePaymentCheckoutRequestDto;
import com.student.management.dto.req.TuitionPaymentRequestDto;
import com.student.management.dto.resp.PaymentTransactionResponseDto;
import com.student.management.entity.PaymentTransaction;
import com.student.management.entity.Student;
import com.student.management.entity.TuitionInvoice;
import com.student.management.enums.PaymentMethod;
import com.student.management.enums.PaymentTransactionStatus;
import com.student.management.enums.TuitionInvoiceStatus;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.repository.PaymentTransactionRepository;
import com.student.management.repository.StudentRepository;
import com.student.management.repository.TuitionInvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.net.URI;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayOSService {

    private final PayOSConfig payOSConfig;
    private final RestClient payOSRestClient;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final TuitionInvoiceRepository tuitionInvoiceRepository;
    private final StudentRepository studentRepository;
    private final TuitionService tuitionService;
    private final EmailReceiptService emailReceiptService;
    private final TelegramAlertService telegramAlertService;
    private final ObjectMapper objectMapper;

    /**
     * Khởi tạo giao dịch thanh toán PayOS (VietQR) cho hóa đơn học phí
     */
    @Transactional(rollbackFor = Exception.class)
    public PaymentTransactionResponseDto createCheckout(String studentId, CreatePaymentCheckoutRequestDto requestDto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDENT_NOT_FOUND, "Không tìm thấy sinh viên: " + studentId));

        TuitionInvoice invoice = tuitionInvoiceRepository.findById(requestDto.getInvoiceId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy hóa đơn học phí ID: " + requestDto.getInvoiceId()));

        if (!invoice.getStudent().getStudentId().equals(studentId)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "Bạn không có quyền thanh toán cho hóa đơn của sinh viên khác.");
        }

        if (invoice.getStatus() == TuitionInvoiceStatus.PAID || invoice.getRemainingAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Hóa đơn học phí này đã được thanh toán đầy đủ.");
        }

        long amount = invoice.getRemainingAmount().longValue();
        if (amount <= 0) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Số tiền cần thanh toán không hợp lệ.");
        }

        // Tạo orderCode duy nhất: nanoTime kết hợp random
        long orderCode = (System.nanoTime() % 10000000000L) * 100 + java.util.concurrent.ThreadLocalRandom.current().nextInt(100);
        String description = ("Hoc phi " + student.getStudentId() + " " + invoice.getSemester().getSemesterCode()).trim();
        if (description.length() > 25) {
            description = description.substring(0, 25);
        }

        String fallbackReturn = "http://localhost:5173/student/tuition?payment_status=success&order_code=" + orderCode;
        String fallbackCancel = "http://localhost:5173/student/tuition?payment_status=cancelled&order_code=" + orderCode;

        String returnUrl = validateRedirectUrl(requestDto.getReturnUrl(), fallbackReturn);
        String cancelUrl = validateRedirectUrl(requestDto.getCancelUrl(), fallbackCancel);

        String checkoutUrl = "";
        String qrCode = "";

        if (payOSConfig.isConfigured()) {
            try {
                // Tạo chữ ký cho request tạo payment link PayOS: amount, cancelUrl, description, orderCode, returnUrl
                String signData = String.format("amount=%d&cancelUrl=%s&description=%s&orderCode=%d&returnUrl=%s",
                        amount, cancelUrl, description, orderCode, returnUrl);
                String signature = calculateHmacSha256(signData, payOSConfig.getChecksumKey());

                Map<String, Object> requestBody = new LinkedHashMap<>();
                requestBody.put("orderCode", orderCode);
                requestBody.put("amount", amount);
                requestBody.put("description", description);
                requestBody.put("returnUrl", returnUrl);
                requestBody.put("cancelUrl", cancelUrl);
                requestBody.put("signature", signature);

                Map<String, Object> item = Map.of(
                        "name", "Học phí " + invoice.getInvoiceCode(),
                        "quantity", 1,
                        "price", amount
                );
                requestBody.put("items", List.of(item));

                String respStr = payOSRestClient.post()
                        .uri("/v2/payment-requests")
                        .header("x-client-id", payOSConfig.getClientId())
                        .header("x-api-key", payOSConfig.getApiKey())
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(requestBody)
                        .retrieve()
                        .body(String.class);

                JsonNode respNode = objectMapper.readTree(respStr);
                if (respNode.path("code").asText("").equals("00") || respNode.path("code").asInt(-1) == 0) {
                    JsonNode dataNode = respNode.path("data");
                    checkoutUrl = dataNode.path("checkoutUrl").asText("");
                    qrCode = dataNode.path("qrCode").asText("");
                    log.info("💳 PayOS Checkout Link created successfully for studentId={} orderCode={} url={}",
                            studentId, orderCode, checkoutUrl);
                } else {
                    String desc = respNode.path("desc").asText("Không thể tạo link thanh toán PayOS");
                    throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Lỗi từ cổng PayOS: " + desc);
                }
            } catch (BusinessException be) {
                throw be;
            } catch (Exception e) {
                log.error("❌ Failed to create PayOS payment link: {}", e.getMessage(), e);
                throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Lỗi kết nối cổng thanh toán PayOS: " + e.getMessage());
            }
        } else {
            // Mock sandbox mode when PayOS credentials not yet provided
            checkoutUrl = returnUrl;
            qrCode = "vietqr-mock-code-" + orderCode;
            log.info("⚠️ PayOS Mock mode: Generated mock payment checkout URL for orderCode={}", orderCode);
        }

        PaymentTransaction transaction = PaymentTransaction.builder()
                .student(student)
                .invoice(invoice)
                .orderCode(orderCode)
                .amount(BigDecimal.valueOf(amount))
                .status(PaymentTransactionStatus.PENDING)
                .checkoutUrl(checkoutUrl)
                .qrCode(qrCode)
                .paymentMethod(PaymentMethod.PAYOS)
                .build();

        PaymentTransaction savedTxn = paymentTransactionRepository.save(transaction);

        return toDto(savedTxn);
    }

    /**
     * Xử lý Webhook PayOS có xác thực chữ ký (HMAC-SHA256) & Idempotent
     */
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> processWebhook(Map<String, Object> payload) {
        log.info("🔔 PAYOS_WEBHOOK_RECEIVED payload={}", payload);

        try {
            String rawJson = objectMapper.writeValueAsString(payload);
            JsonNode root = objectMapper.readTree(rawJson);

            // Kiểm tra chữ ký webhook nếu PayOS được cấu hình
            if (payOSConfig.isConfigured()) {
                boolean isValidSignature = verifyWebhookSignature(root, payOSConfig.getChecksumKey());
                if (!isValidSignature) {
                    log.warn("🚨 PAYOS_WEBHOOK_INVALID_SIGNATURE: Webhook signature verification failed!");
                    telegramAlertService.sendAlert("Cảnh báo chữ ký Webhook PayOS không hợp lệ", "Nhận webhook với chữ ký không khớp. Có thể là giả mạo.", "WARN");
                    return Map.of("error", 1, "message", "Invalid signature");
                }
            }

            JsonNode dataNode = root.path("data");
            if (dataNode.isMissingNode()) {
                return Map.of("error", 1, "message", "Missing data object in webhook");
            }

            long orderCode = dataNode.path("orderCode").asLong();
            int code = root.path("code").asInt(dataNode.path("code").asInt(0));
            String desc = root.path("desc").asText(dataNode.path("desc").asText(""));
            String reference = dataNode.path("reference").asText("");

            Optional<PaymentTransaction> optionalTxn = paymentTransactionRepository.findByOrderCodeForUpdate(orderCode);
            if (optionalTxn.isEmpty()) {
                log.warn("⚠️ PAYOS_WEBHOOK_TXN_NOT_FOUND orderCode={}", orderCode);
                return Map.of("error", 0, "message", "Transaction not found but acknowledged");
            }

            PaymentTransaction txn = optionalTxn.get();

            // Idempotency: Nếu giao dịch đã được đánh dấu PAID trước đó, không ghi nhận lại
            if (txn.getStatus() == PaymentTransactionStatus.PAID) {
                log.info("ℹ️ PAYOS_WEBHOOK_ALREADY_PAID orderCode={}", orderCode);
                return Map.of("error", 0, "message", "Transaction already processed");
            }

            txn.setRawWebhookPayload(rawJson);
            txn.setProviderTransactionId(reference);

            if (code == 0 || "00".equals(String.valueOf(code)) || "success".equalsIgnoreCase(desc)) {
                // Thanh toán thành công
                txn.setStatus(PaymentTransactionStatus.PAID);
                txn.setPaidAt(LocalDateTime.now());
                paymentTransactionRepository.save(txn);

                // Cập nhật sổ cái học phí (Tuition Ledger)
                TuitionPaymentRequestDto paymentReq = TuitionPaymentRequestDto.builder()
                        .invoiceId(txn.getInvoice().getId())
                        .amount(txn.getAmount())
                        .paymentMethod(PaymentMethod.PAYOS)
                        .note("Thanh toán PayOS VietQR - Mã GD #" + orderCode + " (Ref: " + reference + ")")
                        .build();

                tuitionService.recordPayment(txn.getStudent().getStudentId(), paymentReq);

                // Gửi email biên lai học phí bất đồng bộ
                emailReceiptService.sendPaymentReceipt(txn.getStudent(), txn);

                log.info("✅ PAYOS_PAYMENT_SUCCESSFULLY_APPLIED orderCode={} studentId={} amount={}",
                        orderCode, txn.getStudent().getStudentId(), txn.getAmount());
            } else {
                txn.setStatus(PaymentTransactionStatus.FAILED);
                paymentTransactionRepository.save(txn);
                log.warn("⚠️ PAYOS_PAYMENT_FAILED orderCode={} code={} desc={}", orderCode, code, desc);
            }

            return Map.of("error", 0, "message", "Webhook processed successfully");
        } catch (Exception e) {
            log.error("❌ PAYOS_WEBHOOK_PROCESSING_ERROR: {}", e.getMessage(), e);
            telegramAlertService.sendAlert("Lỗi xử lý Webhook PayOS", e.getMessage(), "ERROR");
            return Map.of("error", 1, "message", e.getMessage());
        }
    }

    /**
     * API chủ động đồng bộ trạng thái giao dịch từ PayOS (Active Check / Polling Fallback)
     */
    @Transactional(rollbackFor = Exception.class)
    public PaymentTransactionResponseDto syncTransactionStatus(Long orderCode) {
        PaymentTransaction txn = paymentTransactionRepository.findByOrderCodeForUpdate(orderCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy giao dịch với mã: " + orderCode));

        if (txn.getStatus() == PaymentTransactionStatus.PAID) {
            return toDto(txn);
        }

        if (payOSConfig.isConfigured()) {
            try {
                String respStr = payOSRestClient.get()
                        .uri("/v2/payment-requests/{orderCode}", orderCode)
                        .header("x-client-id", payOSConfig.getClientId())
                        .header("x-api-key", payOSConfig.getApiKey())
                        .retrieve()
                        .body(String.class);

                JsonNode respNode = objectMapper.readTree(respStr);
                JsonNode dataNode = respNode.path("data");
                String status = dataNode.path("status").asText("");
                log.info("🔍 PayOS Active Check orderCode={} status={}", orderCode, status);

                if ("PAID".equalsIgnoreCase(status)) {
                    txn.setStatus(PaymentTransactionStatus.PAID);
                    txn.setPaidAt(LocalDateTime.now());
                    paymentTransactionRepository.save(txn);

                    TuitionPaymentRequestDto paymentReq = TuitionPaymentRequestDto.builder()
                            .invoiceId(txn.getInvoice().getId())
                            .amount(txn.getAmount())
                            .paymentMethod(PaymentMethod.PAYOS)
                            .note("Đồng bộ trực tiếp PayOS VietQR - Mã GD #" + orderCode)
                            .build();

                    tuitionService.recordPayment(txn.getStudent().getStudentId(), paymentReq);
                    emailReceiptService.sendPaymentReceipt(txn.getStudent(), txn);
                } else if ("CANCELLED".equalsIgnoreCase(status)) {
                    txn.setStatus(PaymentTransactionStatus.CANCELLED);
                    paymentTransactionRepository.save(txn);
                } else if ("EXPIRED".equalsIgnoreCase(status)) {
                    txn.setStatus(PaymentTransactionStatus.EXPIRED);
                    paymentTransactionRepository.save(txn);
                }
            } catch (Exception e) {
                log.warn("⚠️ Failed to sync orderCode {} with PayOS API: {}", orderCode, e.getMessage());
            }
        }

        return toDto(txn);
    }

    /**
     * Lấy danh sách lịch sử giao dịch của sinh viên
     */
    @Transactional(readOnly = true)
    public List<PaymentTransactionResponseDto> getStudentTransactions(String studentId) {
        return paymentTransactionRepository.findByStudent_StudentIdOrderByCreatedAtDesc(studentId).stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Xác thực chữ ký HMAC-SHA256 của Webhook PayOS
     */
    public boolean verifyWebhookSignature(JsonNode rootNode, String checksumKey) {
        try {
            String signature = rootNode.path("signature").asText("");
            JsonNode dataNode = rootNode.path("data");
            if (!StringUtils.hasText(signature) || dataNode.isMissingNode()) {
                return false;
            }

            // PayOS signature sort key format: amount, cancelUrl, description, orderCode, returnUrl
            List<String> fieldNames = new ArrayList<>();
            dataNode.fieldNames().forEachRemaining(fieldNames::add);
            Collections.sort(fieldNames);

            StringBuilder dataStr = new StringBuilder();
            for (int i = 0; i < fieldNames.size(); i++) {
                String key = fieldNames.get(i);
                JsonNode val = dataNode.get(key);
                if (val != null && !val.isNull()) {
                    if (dataStr.length() > 0) {
                        dataStr.append("&");
                    }
                    dataStr.append(key).append("=").append(val.asText());
                }
            }

            String calculatedSignature = calculateHmacSha256(dataStr.toString(), checksumKey);
            return calculatedSignature.equalsIgnoreCase(signature);
        } catch (Exception e) {
            log.error("Signature verification error: {}", e.getMessage());
            return false;
        }
    }

    private static final Set<String> ALLOWED_HOSTS = Set.of(
        "localhost", "127.0.0.1",
        "student-management-frontend.vercel.app",
        "eduportal-frontend.vercel.app"
    );

    private String validateRedirectUrl(String url, String fallback) {
        if (!StringUtils.hasText(url)) return fallback;
        try {
            URI uri = URI.create(url);
            if (ALLOWED_HOSTS.contains(uri.getHost())) return url;
        } catch (Exception ignored) {}
        return fallback;
    }

    private String calculateHmacSha256(String data, String key) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secretKey);
        byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder sb = new StringBuilder();
        for (byte b : hash) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private PaymentTransactionResponseDto toDto(PaymentTransaction txn) {
        return PaymentTransactionResponseDto.builder()
                .id(txn.getId())
                .studentId(txn.getStudent().getStudentId())
                .invoiceId(txn.getInvoice().getId())
                .invoiceCode(txn.getInvoice().getInvoiceCode())
                .orderCode(txn.getOrderCode())
                .amount(txn.getAmount())
                .status(txn.getStatus())
                .checkoutUrl(txn.getCheckoutUrl())
                .qrCode(txn.getQrCode())
                .paymentMethod(txn.getPaymentMethod())
                .providerTransactionId(txn.getProviderTransactionId())
                .paidAt(txn.getPaidAt())
                .createdAt(txn.getCreatedAt())
                .build();
    }
}

