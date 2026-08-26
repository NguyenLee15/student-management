package com.student.management.dto.resp;

import com.student.management.enums.PaymentMethod;
import com.student.management.enums.PaymentTransactionStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentTransactionResponseDto {

    private Long id;
    private String studentId;
    private Long invoiceId;
    private String invoiceCode;
    private Long orderCode;
    private BigDecimal amount;
    private PaymentTransactionStatus status;
    private String checkoutUrl;
    private String qrCode;
    private PaymentMethod paymentMethod;
    private String providerTransactionId;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}

