// cSpell:disable
package com.student.management.service.impl;

import com.student.management.dto.req.CartValidationRequestDto;
import com.student.management.dto.req.RegistrationBatchRequestDto;
import com.student.management.dto.resp.*;
import com.student.management.entity.*;
import com.student.management.enums.EnrollmentStatus;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.mapping.CreditClassMapper;
import com.student.management.repository.*;
import com.student.management.service.CourseRegistrationService;
import com.student.management.service.RegistrationPeriodService;
import com.student.management.service.TuitionPolicyService;
import com.student.management.service.TuitionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseRegistrationServiceImpl implements CourseRegistrationService {

    private static final ConcurrentHashMap<String, Long> idempotencyCache = new ConcurrentHashMap<>();

    private final StudentRepository studentRepository;
    private final CreditClassRepository creditClassRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AcademicGradeRepository academicGradeRepository;
    private final SemesterScheduleRepository semesterScheduleRepository;
    private final RegistrationPeriodService registrationPeriodService;
    private final TuitionPolicyService tuitionPolicyService;
    private final TuitionService tuitionService;

    @Override
    @Transactional(readOnly = true)
    public CartValidationResponseDto validateCart(String studentId, CartValidationRequestDto requestDto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDENT_NOT_FOUND, "Không tìm thấy sinh viên ID: " + studentId));

        List<RegistrationPeriodResponseDto> activePeriods = registrationPeriodService.getCurrentlyActivePeriods();
        
        List<ValidationViolationDto> violations = new ArrayList<>();

        if (activePeriods.isEmpty()) {
            violations.add(ValidationViolationDto.builder()
                    .errorCode(ErrorCode.REGISTRATION_PERIOD_CLOSED)
                    .code(ErrorCode.REGISTRATION_PERIOD_CLOSED.getCode())
                    .message("Hiện tại cổng đăng ký tín chỉ chưa mở hoặc đã kết thúc.")
                    .severity("ERROR")
                    .build());
            return CartValidationResponseDto.builder()
                    .valid(false)
                    .violations(violations)
                    .build();
        }

        RegistrationPeriodResponseDto activePeriod = activePeriods.get(0);
        Long semesterId = activePeriod.getSemesterId();
        int maxCreditsAllowed = activePeriod.getMaxCreditsAllowed() != null ? activePeriod.getMaxCreditsAllowed() : 24;

        List<Long> classIds = requestDto.getCreditClassIds() != null ? requestDto.getCreditClassIds() : List.of();
        List<CreditClass> cartClasses = creditClassRepository.findAllById(classIds);

        // 1. Kiểm tra tồn tại các lớp
        if (cartClasses.size() != classIds.size()) {
            violations.add(ValidationViolationDto.builder()
                    .errorCode(ErrorCode.RESOURCE_NOT_FOUND)
                    .code(ErrorCode.RESOURCE_NOT_FOUND.getCode())
                    .message("Có lớp học phần trong giỏ không còn tồn tại trên hệ thống.")
                    .severity("ERROR")
                    .build());
        }

        // 2. Tính tổng số tín chỉ hiện tại và trong giỏ
        int currentRegisteredCredits = enrollmentRepository.sumActiveCreditsByStudentAndSemester(studentId, semesterId);
        int cartCredits = cartClasses.stream()
                .mapToInt(c -> c.getSubject() != null && c.getSubject().getCredits() != null ? c.getSubject().getCredits() : 0)
                .sum();

        if (currentRegisteredCredits + cartCredits > maxCreditsAllowed) {
            violations.add(ValidationViolationDto.builder()
                    .errorCode(ErrorCode.REGISTRATION_CREDIT_LIMIT_EXCEEDED)
                    .code(ErrorCode.REGISTRATION_CREDIT_LIMIT_EXCEEDED.getCode())
                    .message(String.format("Tổng tín chỉ đăng ký (%d tín chỉ) vượt quá giới hạn tối đa cho phép (%d tín chỉ).",
                            (currentRegisteredCredits + cartCredits), maxCreditsAllowed))
                    .severity("ERROR")
                    .build());
        }

        // 3. Kiểm tra môn tiên quyết
        for (CreditClass cc : cartClasses) {
            Subject subject = cc.getSubject();
            if (subject != null && subject.getPrerequisiteSubject() != null) {
                String prereqId = subject.getPrerequisiteSubject().getSubjectId();
                List<AcademicGrade> grades = academicGradeRepository.findByStudentIdAndSubjectId(studentId, prereqId);
                boolean passedPrereq = grades.stream().anyMatch(g -> g.getScoreScale10() != null && g.getScoreScale10().compareTo(new BigDecimal("4.0")) >= 0);
                if (!passedPrereq) {
                    violations.add(ValidationViolationDto.builder()
                            .errorCode(ErrorCode.REGISTRATION_PREREQUISITE_FAILED)
                            .code(ErrorCode.REGISTRATION_PREREQUISITE_FAILED.getCode())
                            .creditClassId(cc.getId())
                            .classCode(cc.getClassCode())
                            .subjectId(subject.getSubjectId())
                            .subjectName(subject.getSubjectName())
                            .message(String.format("Học phần '%s' yêu cầu tiên quyết môn '%s' (%s) nhưng bạn chưa đạt.",
                                    subject.getSubjectName(), subject.getPrerequisiteSubject().getSubjectName(), prereqId))
                            .severity("ERROR")
                            .build());
                }
            }
        }

        // 4. Kiểm tra trùng môn học (trong giỏ hoặc đã đăng ký)
        Set<String> cartSubjectIds = new HashSet<>();
        for (CreditClass cc : cartClasses) {
            if (cc.getSubject() != null) {
                String subId = cc.getSubject().getSubjectId();
                if (!cartSubjectIds.add(subId)) {
                    violations.add(ValidationViolationDto.builder()
                            .errorCode(ErrorCode.REGISTRATION_DUPLICATE_SUBJECT)
                            .code(ErrorCode.REGISTRATION_DUPLICATE_SUBJECT.getCode())
                            .creditClassId(cc.getId())
                            .classCode(cc.getClassCode())
                            .subjectId(subId)
                            .subjectName(cc.getSubject().getSubjectName())
                            .message(String.format("Giỏ đăng ký chứa 2 lớp của cùng một môn học '%s'.", cc.getSubject().getSubjectName()))
                            .severity("ERROR")
                            .build());
                }

                if (enrollmentRepository.existsActiveBySubjectAndSemester(studentId, subId, semesterId)) {
                    violations.add(ValidationViolationDto.builder()
                            .errorCode(ErrorCode.REGISTRATION_DUPLICATE_SUBJECT)
                            .code(ErrorCode.REGISTRATION_DUPLICATE_SUBJECT.getCode())
                            .creditClassId(cc.getId())
                            .classCode(cc.getClassCode())
                            .subjectId(subId)
                            .subjectName(cc.getSubject().getSubjectName())
                            .message(String.format("Bạn đã đăng ký một lớp của môn '%s' trong học kỳ này rồi.", cc.getSubject().getSubjectName()))
                            .severity("ERROR")
                            .build());
                }
            }
        }

        // 5. Kiểm tra sĩ số lớp
        for (CreditClass cc : cartClasses) {
            if (cc.getEnrolledCount() >= cc.getMaxStudents()) {
                violations.add(ValidationViolationDto.builder()
                        .errorCode(ErrorCode.REGISTRATION_CLASS_FULL)
                        .code(ErrorCode.REGISTRATION_CLASS_FULL.getCode())
                        .creditClassId(cc.getId())
                        .classCode(cc.getClassCode())
                        .message(String.format("Lớp '%s' đã đầy sĩ số (%d/%d sinh viên).", cc.getClassCode(), cc.getEnrolledCount(), cc.getMaxStudents()))
                        .severity("ERROR")
                        .build());
            }
        }

        // 6. Kiểm tra trùng lịch học (Schedule Conflict)
        List<Enrollment> currentEnrollments = enrollmentRepository.findActiveEnrollmentsByStudentAndSemester(studentId, semesterId);
        List<Long> enrolledClassIds = currentEnrollments.stream()
                .map(e -> e.getCreditClass().getId())
                .toList();

        List<SemesterSchedule> allSchedules = new ArrayList<>();
        if (!enrolledClassIds.isEmpty()) {
            allSchedules.addAll(semesterScheduleRepository.findByCreditClass_CreditClassIdIn(enrolledClassIds));
        }
        if (!classIds.isEmpty()) {
            allSchedules.addAll(semesterScheduleRepository.findByCreditClass_CreditClassIdIn(classIds));
        }

        // Đối chiếu trùng lịch học: cùng studyTime hoặc cùng ngày/ca
        for (int i = 0; i < allSchedules.size(); i++) {
            SemesterSchedule s1 = allSchedules.get(i);
            for (int j = i + 1; j < allSchedules.size(); j++) {
                SemesterSchedule s2 = allSchedules.get(j);
                if (!s1.getCreditClass().getId().equals(s2.getCreditClass().getId())) {
                    if (isScheduleOverlap(s1, s2)) {
                        violations.add(ValidationViolationDto.builder()
                                .errorCode(ErrorCode.REGISTRATION_SCHEDULE_CONFLICT)
                                .code(ErrorCode.REGISTRATION_SCHEDULE_CONFLICT.getCode())
                                .creditClassId(s2.getCreditClass().getId())
                                .classCode(s2.getCreditClass().getClassCode())
                                .message(String.format("Trùng lịch học giữa lớp '%s' và '%s' (%s - %s).",
                                        s1.getCreditClass().getClassCode(), s2.getCreditClass().getClassCode(),
                                        s1.getStudyTime() != null ? s1.getStudyTime() : s1.getClassShift().getDisplayName(),
                                        s1.getClassroom() != null ? s1.getClassroom().getRoomName() : ""))
                                .severity("ERROR")
                                .build());
                    }
                }
            }
        }

        // 7. Ước tính tổng học phí giỏ đăng ký
        BigDecimal estimatedTuition = BigDecimal.ZERO;
        for (CreditClass cc : cartClasses) {
            BigDecimal unitPrice = tuitionPolicyService.getEffectiveUnitPrice(student, cc, LocalDate.now());
            int credits = cc.getSubject() != null && cc.getSubject().getCredits() != null ? cc.getSubject().getCredits() : 3;
            estimatedTuition = estimatedTuition.add(unitPrice.multiply(BigDecimal.valueOf(credits)));
        }

        return CartValidationResponseDto.builder()
                .valid(violations.isEmpty())
                .totalSelectedCredits(cartCredits)
                .currentRegisteredCredits(currentRegisteredCredits)
                .maxAllowedCredits(maxCreditsAllowed)
                .estimatedTotalTuition(estimatedTuition)
                .violations(violations)
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public RegistrationBatchResponseDto registerBatch(String studentId, RegistrationBatchRequestDto requestDto) {
        log.info("REGISTRATION_BATCH_START studentId={} classIds={} key={}",
                studentId, requestDto.getCreditClassIds(), requestDto.getIdempotencyKey());

        if (requestDto.getIdempotencyKey() != null && !requestDto.getIdempotencyKey().isBlank()) {
            long nowTs = System.currentTimeMillis();
            idempotencyCache.entrySet().removeIf(e -> nowTs - e.getValue() > 60000); // 1 min TTL
            if (idempotencyCache.putIfAbsent(requestDto.getIdempotencyKey(), nowTs) != null) {
                log.warn("IDEMPOTENCY_KEY_DUPLICATE key={}", requestDto.getIdempotencyKey());
                return RegistrationBatchResponseDto.builder()
                        .success(false)
                        .message("Yêu cầu đang được xử lý hoặc đã được xử lý (Duplicate Request).")
                        .build();
            }
        }

        // 1. KHÓA BẢN GHI SINH VIÊN (Chống race condition trần tín chỉ khi mở nhiều tab đồng thời)
        Student student = studentRepository.findByIdForUpdate(studentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STUDENT_NOT_FOUND, "Không tìm thấy sinh viên: " + studentId));

        // 2. Validate giỏ môn học (Kiểm tra điều kiện toàn diện)
        CartValidationRequestDto validateReq = CartValidationRequestDto.builder()
                .creditClassIds(requestDto.getCreditClassIds())
                .build();
        CartValidationResponseDto validationResult = validateCart(studentId, validateReq);

        if (!validationResult.isValid()) {
            ValidationViolationDto firstError = validationResult.getViolations().get(0);
            throw new BusinessException(firstError.getErrorCode(), firstError.getMessage(), validationResult.getViolations());
        }

        RegistrationPeriod activePeriod = registrationPeriodService.getActivePeriodForRegistration();
        Semester semester = activePeriod.getSemester();

        // 3. SẮP XẾP ID TĂNG DẦN VÀ KHÓA TỪNG LỚP HỌC PHẦN (Pessimistic Lock - Chống Deadlock & Sĩ số)
        List<Long> sortedClassIds = requestDto.getCreditClassIds().stream().sorted().distinct().toList();
        List<CreditClass> lockedClasses = new ArrayList<>();

        for (Long classId : sortedClassIds) {
            CreditClass creditClass = creditClassRepository.findByIdForUpdate(classId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.CLASS_NOT_FOUND, "Không tìm thấy lớp học phần ID: " + classId));

            if (creditClass.getEnrolledCount() >= creditClass.getMaxStudents()) {
                throw new BusinessException(ErrorCode.REGISTRATION_CLASS_FULL, 
                        String.format("Lớp %s đã đủ sĩ số tối đa (%d/%d sinh viên).", creditClass.getClassCode(), creditClass.getEnrolledCount(), creditClass.getMaxStudents()));
            }

            creditClass.setEnrolledCount(creditClass.getEnrolledCount() + 1);
            lockedClasses.add(creditClassRepository.save(creditClass));
        }

        // 4. Lưu bản ghi Enrollment và sinh TuitionItem tương ứng
        List<EnrollmentResponseDto> enrollmentDtos = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (CreditClass cc : lockedClasses) {
            Enrollment enrollment = Enrollment.builder()
                    .student(student)
                    .creditClass(cc)
                    .semester(semester)
                    .enrollmentDate(now)
                    .status(EnrollmentStatus.ENROLLED)
                    .build();
            Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

            BigDecimal unitPrice = tuitionPolicyService.getEffectiveUnitPrice(student, cc, LocalDate.now());
            tuitionService.addCourseEnrollmentToInvoice(student, semester, savedEnrollment, cc, unitPrice);

            enrollmentDtos.add(toEnrollmentDto(savedEnrollment));
        }

        TuitionInvoiceResponseDto invoice = tuitionService.getStudentInvoiceBySemester(studentId, semester.getId());

        log.info("REGISTRATION_BATCH_SUCCESS studentId={} registeredCount={} invoiceId={}",
                studentId, enrollmentDtos.size(), invoice != null ? invoice.getId() : null);

        return RegistrationBatchResponseDto.builder()
                .success(true)
                .registeredClassCount(enrollmentDtos.size())
                .totalRegisteredCredits(validationResult.getCurrentRegisteredCredits() + validationResult.getTotalSelectedCredits())
                .invoiceId(invoice != null ? invoice.getId() : null)
                .totalTuitionAmount(invoice != null ? invoice.getTotalAmount() : BigDecimal.ZERO)
                .enrollments(enrollmentDtos)
                .message("Đăng ký học phần thành công! Các môn học đã được cập nhật vào Thời khóa biểu và Hóa đơn học phí.")
                .build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void dropCourse(String studentId, Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findByIdForUpdate(enrollmentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy phiếu đăng ký học phần ID: " + enrollmentId));

        // Kiểm tra quyền sở hữu sinh viên
        if (!enrollment.getStudent().getStudentId().equals(studentId)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "Bạn không thể thao tác trên phiếu đăng ký của sinh viên khác.");
        }

        if (enrollment.getStatus() != EnrollmentStatus.ENROLLED) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Môn học này không ở trạng thái đang theo học.");
        }

        CreditClass creditClass = creditClassRepository.findByIdForUpdate(enrollment.getCreditClass().getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.CLASS_NOT_FOUND));

        LocalDateTime now = LocalDateTime.now();
        boolean isRegistrationOpen = registrationPeriodService.getCurrentlyActivePeriods().stream()
                .anyMatch(p -> p.getSemesterId().equals(enrollment.getSemester().getId()));

        if (isRegistrationOpen) {
            // Giai đoạn 1: Trong đợt đăng ký -> Hoàn phí 100%, giảm sĩ số
            enrollment.setStatus(EnrollmentStatus.DROPPED);
            enrollment.setDropDate(now);
            creditClass.setEnrolledCount(Math.max(0, creditClass.getEnrolledCount() - 1));
            creditClassRepository.save(creditClass);
            enrollmentRepository.save(enrollment);

            tuitionService.cancelCourseFromInvoice(enrollmentId);
            log.info("COURSE_DROPPED_WITH_REFUND studentId={} enrollmentId={} classCode={}",
                    studentId, enrollmentId, creditClass.getClassCode());
        } else {
            // Giai đoạn 2: Sau khi đóng đợt -> WITHDRAWN, không hoàn phí
            enrollment.setStatus(EnrollmentStatus.WITHDRAWN);
            enrollment.setDropDate(now);
            enrollmentRepository.save(enrollment);
            log.info("COURSE_WITHDRAWN_NO_REFUND studentId={} enrollmentId={} classCode={}",
                    studentId, enrollmentId, creditClass.getClassCode());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponseDto> getMyEnrollments(String studentId, Long semesterId) {
        Long semId = semesterId;
        if (semId == null) {
            List<RegistrationPeriodResponseDto> activePeriods = registrationPeriodService.getCurrentlyActivePeriods();
            semId = !activePeriods.isEmpty() ? activePeriods.get(0).getSemesterId() : 1L;
        }

        return enrollmentRepository.findActiveEnrollmentsByStudentAndSemester(studentId, semId).stream()
                .map(this::toEnrollmentDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CreditClassResponseDto> getAvailableClassesForRegistration(String studentId, Long semesterId) {
        Long semId = semesterId;
        if (semId == null) {
            List<RegistrationPeriodResponseDto> activePeriods = registrationPeriodService.getCurrentlyActivePeriods();
            semId = !activePeriods.isEmpty() ? activePeriods.get(0).getSemesterId() : 1L;
        }

        List<CreditClass> classes = creditClassRepository.findBySemesterId(semId);
        return classes.stream()
                .map(CreditClassMapper::toDto)
                .toList();
    }

    private boolean isScheduleOverlap(SemesterSchedule s1, SemesterSchedule s2) {
        if (s1.getStudyTime() != null && s2.getStudyTime() != null && s1.getStudyTime().equalsIgnoreCase(s2.getStudyTime())) {
            return true;
        }
        if (s1.getClassShift() != null && s2.getClassShift() != null && s1.getClassShift() == s2.getClassShift()) {
            if (s1.getStudyTime() != null && s2.getStudyTime() != null) {
                // Ví dụ: Thứ 2 vs Thứ 2
                String d1 = s1.getStudyTime().split(",")[0].trim();
                String d2 = s2.getStudyTime().split(",")[0].trim();
                return d1.equalsIgnoreCase(d2);
            }
        }
        return false;
    }

    private EnrollmentResponseDto toEnrollmentDto(Enrollment e) {
        CreditClass cc = e.getCreditClass();
        Subject sub = cc != null ? cc.getSubject() : null;
        Teacher t = cc != null ? cc.getTeacher() : null;
        Classroom cr = cc != null ? cc.getClassroom() : null;
        Semester sem = e.getSemester();

        return EnrollmentResponseDto.builder()
                .id(e.getId())
                .studentId(e.getStudent().getStudentId())
                .studentName(e.getStudent().getFullName())
                .creditClassId(cc != null ? cc.getId() : null)
                .classCode(cc != null ? cc.getClassCode() : null)
                .subjectId(sub != null ? sub.getSubjectId() : null)
                .subjectName(sub != null ? sub.getSubjectName() : null)
                .credits(sub != null ? sub.getCredits() : null)
                .teacherName(t != null ? t.getFullName() : null)
                .roomName(cr != null ? cr.getRoomName() : null)
                .semesterId(sem != null ? sem.getId() : null)
                .semesterName(sem != null ? sem.getName() : null)
                .enrollmentDate(e.getEnrollmentDate())
                .status(e.getStatus())
                .statusName(e.getStatus().getDisplayName())
                .dropDate(e.getDropDate())
                .build();
    }
}
