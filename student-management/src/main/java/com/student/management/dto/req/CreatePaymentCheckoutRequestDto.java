package com.student.management.dto.req;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreatePaymentCheckoutRequestDto {

    @NotNull(message = "Mã hóa đơn (invoiceId) không được để trống")
    private Long invoiceId;

    private String returnUrl;
    private String cancelUrl;
}

