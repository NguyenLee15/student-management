// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.req.AcademicGradeRequestDto;
import com.student.management.dto.req.AcademicGradeUpdateDto;
import com.student.management.dto.resp.AcademicGradeResponseDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.TranscriptResponseDto;
import com.student.management.enums.Semester;
import com.student.management.enums.StudyPhase;
import com.student.management.service.AcademicGradeService;
import com.student.management.security.SecurityService;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/academic-grades")
@RequiredArgsConstructor
@Validated
@Tag(name = "API Quản Lý Điểm Số", description = "Quản lý điểm học tập sinh viên và bảng điểm theo Thông tư 08")
public class AcademicGradeRestController {

    private final AcademicGradeService academicGradeService;
    private final SecurityService securityService;

    @GetMapping
    @Operation(summary = "Lấy danh sách điểm số theo bộ lọc và phân trang")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Page<AcademicGradeResponseDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String studentId,
            @RequestParam(required = false) String subjectId,
            @RequestParam(required = false) Semester semester,
            @RequestParam(required = false) String academicYear,
            @RequestParam(required = false) StudyPhase studyPhase) {
        
        String queryStudentId = studentId;
        if (securityService.isStudentRole()) {
            queryStudentId = securityService.getCurrentStudentId();
        }

        Page<AcademicGradeResponseDto> result = academicGradeService.searchAndFilter(
                queryStudentId, subjectId, semester, academicYear, studyPhase, PageRequest.of(page, size)
        );
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách Grades thành công", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin điểm số theo ID")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('TEACHER') and @securityService.isClassInstructorByGradeId(#id)) or (hasRole('STUDENT') and @securityService.isSelfGrade(#id))")
    public ResponseEntity<ApiResponse<AcademicGradeResponseDto>> getById(@PathVariable Integer id) {
        AcademicGradeResponseDto grade = academicGradeService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(grade));
    }

    @GetMapping("/transcript/{studentId}")
    @Operation(summary = "Lấy bảng điểm học tập đầy đủ của sinh viên theo Thông tư 08/2021/TT-BGDĐT")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('STUDENT') and @securityService.isSelfStudent(#studentId))")
    public ResponseEntity<ApiResponse<TranscriptResponseDto>> getTranscript(@PathVariable String studentId) {
        return ResponseEntity.ok(ApiResponse.success("Tính toán bảng điểm thành công", academicGradeService.getTranscriptByStudentId(studentId)));
    }

    @PostMapping
    @Operation(summary = "Nhập điểm mới")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('TEACHER') and @securityService.isInstructorForGradeRequest(#dto))")
    public ResponseEntity<ApiResponse<AcademicGradeResponseDto>> create(@Valid @RequestBody AcademicGradeRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới Grade thành công", academicGradeService.create(dto)));
    }

    @PostMapping("/batch")
    @Operation(summary = "Lưu hoặc cập nhật danh sách điểm theo lô cho lớp học phần")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<java.util.List<AcademicGradeResponseDto>>> saveBatch(
            @Valid @RequestBody java.util.List<AcademicGradeRequestDto> dtos) {
        if (securityService.isTeacherRole() && !securityService.isAdminRole()) {
            for (AcademicGradeRequestDto dto : dtos) {
                if (!securityService.isInstructorForGradeRequest(dto)) {
                    throw new BusinessException(ErrorCode.ACCESS_DENIED, "Giảng viên không có quyền nhập điểm cho sinh viên " + dto.getStudentId() + " ở môn học " + dto.getSubjectId());
                }
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Lưu điểm hàng loạt thành công", academicGradeService.saveBatch(dtos)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật điểm")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('TEACHER') and @securityService.isClassInstructorByGradeId(#id))")
    public ResponseEntity<ApiResponse<AcademicGradeResponseDto>> update(@PathVariable Integer id, @Valid @RequestBody AcademicGradeUpdateDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật Grade thành công", academicGradeService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa bản ghi điểm")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('TEACHER') and @securityService.isClassInstructorByGradeId(#id))")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        academicGradeService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa Grade thành công", null));
    }
}
