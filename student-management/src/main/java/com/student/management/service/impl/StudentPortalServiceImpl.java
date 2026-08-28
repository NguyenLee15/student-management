package com.student.management.service.impl;

import com.student.management.dto.resp.StudentPortalOverviewDto;
import com.student.management.dto.resp.StudentTimetableEntryDto;
import com.student.management.dto.resp.TuitionInvoiceResponseDto;
import com.student.management.entity.*;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.repository.AcademicGradeRepository;
import com.student.management.repository.EnrollmentRepository;
import com.student.management.repository.SemesterScheduleRepository;
import com.student.management.repository.StudentRepository;
import com.student.management.service.StudentPortalService;
import com.student.management.service.TuitionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentPortalServiceImpl implements StudentPortalService {

    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AcademicGradeRepository academicGradeRepository;
    private final SemesterScheduleRepository semesterScheduleRepository;
    private final TuitionService tuitionService;

    @Override
    @Transactional(readOnly = true)
    public StudentPortalOverviewDto getMyOverview(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDENT_NOT_FOUND, "Không tìm thấy hồ sơ sinh viên: " + studentId));

        List<AcademicGrade> grades = academicGradeRepository.findByStudentId(studentId);

        // Tính GPA tích lũy
        BigDecimal totalScore = BigDecimal.ZERO;
        int totalCredits = 0;

        for (AcademicGrade g : grades) {
            if (g.getScoreScale10() != null && g.getSubject() != null) {
                int credits = g.getSubject().getCredits() != null ? g.getSubject().getCredits() : 3;
                totalScore = totalScore.add(g.getScoreScale10().multiply(BigDecimal.valueOf(credits)));
                totalCredits += credits;
            }
        }

        BigDecimal gpa10 = totalCredits > 0 ? totalScore.divide(BigDecimal.valueOf(totalCredits), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        BigDecimal gpa4 = gpa10.multiply(new BigDecimal("0.4")).setScale(2, RoundingMode.HALF_UP);

        String standing;
        if (gpa10.compareTo(new BigDecimal("9.0")) >= 0) standing = "Xuất sắc";
        else if (gpa10.compareTo(new BigDecimal("8.0")) >= 0) standing = "Giỏi";
        else if (gpa10.compareTo(new BigDecimal("6.5")) >= 0) standing = "Khá";
        else if (gpa10.compareTo(new BigDecimal("5.0")) >= 0) standing = "Trung bình";
        else standing = "Yếu / Cảnh báo học vụ";

        int requiredCredits = 135; // Chuẩn cử nhân công nghệ thông tin
        int progressPct = Math.min(100, (int) Math.round((double) totalCredits / requiredCredits * 100));

        // Môn học kỳ này
        List<Enrollment> enrollments = enrollmentRepository.findActiveEnrollmentsByStudentAndSemester(studentId, 1L);
        int currentSemCredits = enrollments.stream()
                .mapToInt(e -> e.getCreditClass().getSubject() != null ? e.getCreditClass().getSubject().getCredits() : 0)
                .sum();

        // Học phí công nợ
        TuitionInvoiceResponseDto invoice = tuitionService.getStudentInvoiceBySemester(studentId, 1L);
        BigDecimal outstandingTuition = invoice != null ? invoice.getRemainingAmount() : BigDecimal.ZERO;

        // Lịch học hôm nay
        List<StudentTimetableEntryDto> allTimetable = getMyTimetable(studentId, 1L);

        return StudentPortalOverviewDto.builder()
                .studentId(student.getStudentId())
                .fullName(student.getFullName())
                .email(student.getEmail())
                .className(student.getStudentClass() != null ? student.getStudentClass().getClassName() : "N/A")
                .facultyName(student.getStudentClass() != null && student.getStudentClass().getFaculty() != null ? student.getStudentClass().getFaculty().getFacultyName() : "N/A")
                .academicYearName(student.getAcademicYear() != null ? student.getAcademicYear().getAcademicYearName() : "N/A")
                .cumulativeGpa10(gpa10)
                .cumulativeGpa4(gpa4)
                .totalAccumulatedCredits(totalCredits)
                .requiredCredits(requiredCredits)
                .progressPercentage(progressPct)
                .academicStanding(standing)
                .registeredClassesThisSemester(enrollments.size())
                .registeredCreditsThisSemester(currentSemCredits)
                .tuitionOutstandingBalance(outstandingTuition)
                .todaySchedule(allTimetable)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentTimetableEntryDto> getMyTimetable(String studentId, Long semesterId) {
        Long semId = semesterId != null ? semesterId : 1L;
        List<Enrollment> enrollments = enrollmentRepository.findActiveEnrollmentsByStudentAndSemester(studentId, semId);

        List<Long> classIds = enrollments.stream()
                .map(e -> e.getCreditClass().getId())
                .toList();

        if (classIds.isEmpty()) {
            return List.of();
        }

        List<SemesterSchedule> schedules = semesterScheduleRepository.findByCreditClass_CreditClassIdIn(classIds);
        return schedules.stream()
                .map(s -> StudentTimetableEntryDto.builder()
                        .scheduleId(s.getScheduleId())
                        .creditClassId(s.getCreditClass().getId())
                        .classCode(s.getCreditClass().getClassCode())
                        .subjectId(s.getSubject().getSubjectId())
                        .subjectName(s.getSubject().getSubjectName())
                        .credits(s.getSubject().getCredits())
                        .teacherName(s.getTeacher() != null ? s.getTeacher().getFullName() : null)
                        .roomName(s.getClassroom() != null ? s.getClassroom().getRoomName() : null)
                        .studyTime(s.getStudyTime())
                        .classShift(s.getClassShift())
                        .shiftName(s.getClassShift() != null ? s.getClassShift().getDisplayName() : null)
                        .startDate(s.getStartDate())
                        .endDate(s.getEndDate())
                        .build())
                .toList();
    }
}
