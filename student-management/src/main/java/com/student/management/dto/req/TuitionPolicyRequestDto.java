// cSpell:disable
package com.student.management.dto.req;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TuitionPolicyRequestDto {

    @NotNull(message = "ID học kỳ là bắt buộc")
    private Long semesterId;

    private String facultyId; // Nullable: Áp dụng toàn trường nếu null

    @NotNull(message = "Đơn giá tín chỉ là bắt buộc")
    @DecimalMin(value = "0.0", inclusive = false, message = "Đơn giá tín chỉ phải lớn hơn 0")
    private BigDecimal unitPricePerCredit;

    @NotNull(message = "Ngày hiệu lực là bắt buộc")
    private LocalDate effectiveDate;

    @Builder.Default
    private Boolean active = true;
}
