package com.student.management.controller.api;

import com.student.management.dto.req.CartValidationRequestDto;
import com.student.management.dto.req.RegistrationBatchRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.CartValidationResponseDto;
import com.student.management.dto.resp.CreditClassResponseDto;
import com.student.management.dto.resp.EnrollmentResponseDto;
import com.student.management.dto.resp.RegistrationBatchResponseDto;
import com.student.management.security.SecurityService;
import com.student.management.service.CourseRegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students/registration")
@RequiredArgsConstructor
@Tag(name = "Student Course Registration API", description = "Endpoints phục vụ Đăng ký học phần tín chỉ cho Sinh viên")
public class StudentRegistrationRestController {

    private final CourseRegistrationService courseRegistrationService;
    private final SecurityService securityService;

    @GetMapping("/available-classes")
    @Operation(summary = "Lấy danh sách các lớp học phần đang mở đăng ký")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<CreditClassResponseDto>>> getAvailableClasses(
            @RequestParam(required = false) Long semesterId) {
        String studentId = securityService.getCurrentStudentId();
        List<CreditClassResponseDto> classes = courseRegistrationService.getAvailableClassesForRegistration(studentId, semesterId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp mở đăng ký thành công", classes));
    }

    @PostMapping("/cart-validate")
    @Operation(summary = "Kiểm tra toàn diện giỏ môn học (trả về toàn bộ danh sách vi phạm nếu có)")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<CartValidationResponseDto>> validateCart(
            @Valid @RequestBody CartValidationRequestDto requestDto) {
        String studentId = securityService.getCurrentStudentId();
        CartValidationResponseDto result = courseRegistrationService.validateCart(studentId, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Kiểm tra giỏ môn học thành công", result));
    }

    @PostMapping("/register-batch")
    @Operation(summary = "Thực hiện đăng ký học phần theo lô nguyên tử (Atomic Batch Registration)")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationBatchResponseDto>> registerBatch(
            @Valid @RequestBody RegistrationBatchRequestDto requestDto) {
        String studentId = securityService.getCurrentStudentId();
        RegistrationBatchResponseDto result = courseRegistrationService.registerBatch(studentId, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký học phần thành công", result));
    }

    @PostMapping("/drop-class/{enrollmentId}")
    @Operation(summary = "Rút môn học đã đăng ký")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> dropCourse(@PathVariable Long enrollmentId) {
        String studentId = securityService.getCurrentStudentId();
        courseRegistrationService.dropCourse(studentId, enrollmentId);
        return ResponseEntity.ok(ApiResponse.success("Rút học phần thành công", null));
    }

    @GetMapping("/my-enrollments")
    @Operation(summary = "Lấy danh sách các lớp học phần sinh viên đã đăng ký")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<EnrollmentResponseDto>>> getMyEnrollments(
            @RequestParam(required = false) Long semesterId) {
        String studentId = securityService.getCurrentStudentId();
        List<EnrollmentResponseDto> enrollments = courseRegistrationService.getMyEnrollments(studentId, semesterId);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách học phần đã đăng ký thành công", enrollments));
    }
}
