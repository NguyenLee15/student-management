// cSpell:disable
package com.student.management.service;

import com.student.management.dto.req.TuitionPaymentRequestDto;
import com.student.management.dto.resp.TuitionInvoiceResponseDto;
import com.student.management.dto.resp.TuitionPaymentResponseDto;
import com.student.management.entity.CreditClass;
import com.student.management.entity.Enrollment;
import com.student.management.entity.Semester;
import com.student.management.entity.Student;

import java.math.BigDecimal;
import java.util.List;

public interface TuitionService {
    TuitionInvoiceResponseDto getStudentInvoiceBySemester(String studentId, Long semesterId);
    List<TuitionInvoiceResponseDto> getAllStudentInvoices(String studentId);
    
    // Core ledger operations inside registration transactions
    void addCourseEnrollmentToInvoice(Student student, Semester semester, Enrollment enrollment, CreditClass creditClass, BigDecimal unitPrice);
    void cancelCourseFromInvoice(Long enrollmentId);
    
    // Payment settlement
    TuitionPaymentResponseDto recordPayment(String studentId, TuitionPaymentRequestDto requestDto);
}
