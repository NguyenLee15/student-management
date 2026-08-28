// cSpell:disable
package com.student.management.dto.resp;

import com.student.management.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TuitionPaymentResponseDto {
    private Long id;
    private String transactionCode;
    private Long invoiceId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private String paymentMethodName;
    private LocalDateTime paymentTime;
    private String note;
}
