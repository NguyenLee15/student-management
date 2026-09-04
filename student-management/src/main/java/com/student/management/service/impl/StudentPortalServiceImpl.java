// cSpell:disable
package com.student.management.service.impl;

import com.student.management.dto.resp.RegistrationPeriodResponseDto;
import com.student.management.dto.resp.StudentPortalOverviewDto;
import com.student.management.dto.resp.StudentTimetableEntryDto;
import com.student.management.dto.resp.TranscriptResponseDto;
import com.student.management.dto.resp.TuitionInvoiceResponseDto;
import com.student.management.entity.*;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.repository.AcademicGradeRepository;
import com.student.management.repository.SemesterRepository;
import com.student.management.repository.EnrollmentRepository;
import com.student.management.repository.SemesterScheduleRepository;
import com.student.management.repository.StudentRepository;
import com.student.management.service.AcademicGradeService;
import com.student.management.service.RegistrationPeriodService;
import com.student.management.service.StudentPortalService;
import com.student.management.service.TuitionService;
import com.student.management.util.GradeCalculationUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
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
    private final AcademicGradeService academicGradeService;
    private final RegistrationPeriodService registrationPeriodService;
    private final SemesterRepository semesterRepository;

    @Override
    @Transactional(readOnly = true)
    public StudentPortalOverviewDto getMyOverview(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDENT_NOT_FOUND, "Không tìm thấy hồ sơ sinh viên: " + studentId));

        // 1. Tính toán GPA và số tín chỉ tích lũy chính xác theo Thông tư 08/2021/TT-BGDĐT
        TranscriptResponseDto transcript = academicGradeService.getTranscriptByStudentId(studentId);
        BigDecimal gpa10 = transcript != null && transcript.getCumulativeGpa10() != null 
                ? transcript.getCumulativeGpa10() : BigDecimal.ZERO;
        BigDecimal gpa4 = transcript != null && transcript.getCumulativeGpa4() != null 
                ? transcript.getCumulativeGpa4() : BigDecimal.ZERO;
        int totalCredits = transcript != null && transcript.getTotalCreditsEarned() != null 
                ? transcript.getTotalCreditsEarned() : 0;
        String standing = GradeCalculationUtils.determineAcademicStanding(gpa4);

        int requiredCredits = 135; // Chuẩn cử nhân đào tạo tín chỉ
        int progressPct = Math.min(100, (int) Math.round((double) totalCredits / requiredCredits * 100));

        // 2. Xác định học kỳ đang hoạt động linh hoạt
        Long activeSemesterId = resolveActiveSemesterId(null);

        // 3. Môn học và tín chỉ đăng ký học kỳ này
        List<Enrollment> enrollments = enrollmentRepository.findActiveEnrollmentsByStudentAndSemester(studentId, activeSemesterId);
        int currentSemCredits = enrollments.stream()
                .mapToInt(e -> e.getCreditClass().getSubject() != null && e.getCreditClass().getSubject().getCredits() != null 
                        ? e.getCreditClass().getSubject().getCredits() : 0)
                .sum();

        // 4. Học phí công nợ học kỳ này
        TuitionInvoiceResponseDto invoice = tuitionService.getStudentInvoiceBySemester(studentId, activeSemesterId);
        BigDecimal outstandingTuition = invoice != null ? invoice.getRemainingAmount() : BigDecimal.ZERO;

        // 5. Lịch học tuần và lọc riêng lịch học ngày hôm nay
        List<StudentTimetableEntryDto> allTimetable = getMyTimetable(studentId, activeSemesterId);
        DayOfWeek todayDow = LocalDate.now().getDayOfWeek();
        List<StudentTimetableEntryDto> todaySchedule = allTimetable.stream()
                .filter(t -> matchesDayOfWeek(t.getStudyTime(), todayDow))
                .toList();

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
                .todaySchedule(todaySchedule)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public TranscriptResponseDto getMyTranscript(String studentId) {
        return academicGradeService.getTranscriptByStudentId(studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentTimetableEntryDto> getMyTimetable(String studentId, Long semesterId) {
        Long semId = resolveActiveSemesterId(semesterId);
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

    private Long resolveActiveSemesterId(Long semesterId) {
        if (semesterId != null) return semesterId;
        List<RegistrationPeriodResponseDto> activePeriods = registrationPeriodService.getCurrentlyActivePeriods();
        if (activePeriods != null && !activePeriods.isEmpty() && activePeriods.get(0).getSemesterId() != null) {
            return activePeriods.get(0).getSemesterId();
        }
        List<Semester> activeSemesters = semesterRepository.findAllActiveSemesters();
        if (!activeSemesters.isEmpty()) {
            return activeSemesters.get(0).getId();
        }
        return 1L;
    }

    private boolean matchesDayOfWeek(String studyTime, DayOfWeek dow) {
        if (studyTime == null || studyTime.isBlank()) return false;
        String st = studyTime.toLowerCase();
        return switch (dow) {
            case MONDAY -> st.contains("thứ 2") || st.contains("thứ hai") || st.contains("t2") || st.contains("monday");
            case TUESDAY -> st.contains("thứ 3") || st.contains("thứ ba") || st.contains("t3") || st.contains("tuesday");
            case WEDNESDAY -> st.contains("thứ 4") || st.contains("thứ tư") || st.contains("t4") || st.contains("wednesday");
            case THURSDAY -> st.contains("thứ 5") || st.contains("thứ năm") || st.contains("t5") || st.contains("thursday");
            case FRIDAY -> st.contains("thứ 6") || st.contains("thứ sáu") || st.contains("t6") || st.contains("friday");
            case SATURDAY -> st.contains("thứ 7") || st.contains("thứ bảy") || st.contains("t7") || st.contains("saturday");
            case SUNDAY -> st.contains("chủ nhật") || st.contains("cn") || st.contains("sunday");
        };
    }
}
