package com.student.management.dto.req;

import com.student.management.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TuitionPaymentRequestDto {

    @NotNull(message = "ID hóa đơn học phí là bắt buộc")
    private Long invoiceId;

    @NotNull(message = "Số tiền thanh toán là bắt buộc")
    @DecimalMin(value = "10000.0", message = "Số tiền thanh toán tối thiểu là 10,000 VNĐ")
    private BigDecimal amount;

    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.BANK_TRANSFER;

    private String note;
}
