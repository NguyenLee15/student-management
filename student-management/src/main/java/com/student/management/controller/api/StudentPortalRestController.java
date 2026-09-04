// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.req.TuitionPaymentRequestDto;
import com.student.management.dto.resp.*;
import com.student.management.security.SecurityService;
import com.student.management.service.StudentPortalService;
import com.student.management.service.TuitionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students/portal/me")
@RequiredArgsConstructor
@Tag(name = "API Cổng Thông Tin Sinh Viên", description = "Cổng thông tin cá nhân sinh viên (Tiến độ học tập, TKB, Học phí)")
public class StudentPortalRestController {

    private final StudentPortalService studentPortalService;
    private final TuitionService tuitionService;
    private final SecurityService securityService;

    @GetMapping("/overview")
    @Operation(summary = "Lấy thông tin tổng quan hồ sơ sinh viên, GPA, tiến độ học tập")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<StudentPortalOverviewDto>> getMyOverview() {
        String studentId = securityService.getCurrentStudentId();
        StudentPortalOverviewDto overview = studentPortalService.getMyOverview(studentId);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin tổng quan thành công", overview));
    }

    @GetMapping("/transcript")
    @Operation(summary = "Lấy bảng điểm học tập cá nhân của sinh viên")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<TranscriptResponseDto>> getMyTranscript() {
        String studentId = securityService.getCurrentStudentId();
        TranscriptResponseDto transcript = studentPortalService.getMyTranscript(studentId);
        return ResponseEntity.ok(ApiResponse.success("Lấy bảng điểm thành công", transcript));
    }

    @GetMapping("/timetable")
    @Operation(summary = "Lấy thời khóa biểu học tập của sinh viên")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<StudentTimetableEntryDto>>> getMyTimetable(
            @RequestParam(required = false) Long semesterId) {
        String studentId = securityService.getCurrentStudentId();
        List<StudentTimetableEntryDto> timetable = studentPortalService.getMyTimetable(studentId, semesterId);
        return ResponseEntity.ok(ApiResponse.success("Lấy thời khóa biểu thành công", timetable));
    }

    @GetMapping("/tuition")
    @Operation(summary = "Lấy hóa đơn học phí và công nợ của sinh viên theo học kỳ")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<TuitionInvoiceResponseDto>> getMyTuition(
            @RequestParam(required = false) Long semesterId) {
        String studentId = securityService.getCurrentStudentId();
        TuitionInvoiceResponseDto invoice = tuitionService.getStudentInvoiceBySemester(studentId, semesterId);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin học phí thành công", invoice));
    }

    @GetMapping("/tuition/all")
    @Operation(summary = "Lấy toàn bộ lịch sử hóa đơn học phí của sinh viên")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<TuitionInvoiceResponseDto>>> getAllMyTuition() {
        String studentId = securityService.getCurrentStudentId();
        List<TuitionInvoiceResponseDto> invoices = tuitionService.getAllStudentInvoices(studentId);
        return ResponseEntity.ok(ApiResponse.success("Lấy lịch sử học phí thành công", invoices));
    }

    @PostMapping("/tuition/pay")
    @Operation(summary = "Thanh toán học phí trực tuyến")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<TuitionPaymentResponseDto>> payTuition(
            @Valid @RequestBody TuitionPaymentRequestDto requestDto) {
        String studentId = securityService.getCurrentStudentId();
        TuitionPaymentResponseDto payment = tuitionService.recordPayment(studentId, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Thanh toán học phí thành công", payment));
    }
}
