// cSpell:disable
package com.student.management.dto.resp;

import com.student.management.enums.TuitionInvoiceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TuitionInvoiceResponseDto {
    private Long id;
    private String invoiceCode;
    private String studentId;
    private String studentName;
    private Long semesterId;
    private String semesterName;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal remainingAmount;
    private TuitionInvoiceStatus status;
    private String statusName;
    private LocalDate dueDate;
    private List<TuitionItemResponseDto> items;
    private List<TuitionPaymentResponseDto> payments;
}
