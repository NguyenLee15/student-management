// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.req.CreatePaymentCheckoutRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.PaymentTransactionResponseDto;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.security.SecurityService;
import com.student.management.service.PayOSService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "API Thanh Toán & Học Phí", description = "Cổng thanh toán học phí VietQR PayOS & Webhook xử lý giao dịch")
public class PaymentRestController {

    private final PayOSService payOSService;
    private final SecurityService securityService;

    @PostMapping("/create-checkout")
    @Operation(summary = "Tạo link thanh toán VietQR PayOS cho hóa đơn học phí")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<PaymentTransactionResponseDto>> createCheckout(
            @Valid @RequestBody CreatePaymentCheckoutRequestDto requestDto) {
        String studentId = securityService.getCurrentStudentId();
        PaymentTransactionResponseDto transaction = payOSService.createCheckout(studentId, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Khởi tạo link thanh toán VietQR thành công", transaction));
    }

    @PostMapping("/payos-webhook")
    @Operation(summary = "Endpoint công khai tiếp nhận Webhook thông báo từ cổng PayOS")
    public ResponseEntity<Map<String, Object>> handlePayOSWebhook(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = payOSService.processWebhook(payload);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sync-status/{orderCode}")
    @Operation(summary = "Chủ động kiểm tra và đồng bộ trạng thái giao dịch từ PayOS")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<ApiResponse<PaymentTransactionResponseDto>> syncStatus(@PathVariable Long orderCode) {
        String studentId = securityService.isStudentRole() ? securityService.getCurrentStudentId() : null;
        PaymentTransactionResponseDto transaction = payOSService.syncTransactionStatus(orderCode, studentId);
        return ResponseEntity.ok(ApiResponse.success("Đồng bộ trạng thái giao dịch thành công", transaction));
    }

    @GetMapping("/my-transactions")
    @Operation(summary = "Lấy danh sách lịch sử giao dịch thanh toán của sinh viên")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<PaymentTransactionResponseDto>>> getMyTransactions() {
        String studentId = securityService.getCurrentStudentId();
        List<PaymentTransactionResponseDto> list = payOSService.getStudentTransactions(studentId);
        return ResponseEntity.ok(ApiResponse.success("Lấy lịch sử giao dịch thành công", list));
    }
}

