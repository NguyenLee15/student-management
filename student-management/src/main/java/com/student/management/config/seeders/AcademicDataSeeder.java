// cSpell:disable
package com.student.management.config.seeders;

import com.student.management.entity.*;
import com.student.management.enums.ClassShift;
import com.student.management.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class AcademicDataSeeder {

    private final SemesterRepository semesterRepository;
    private final RegistrationPeriodRepository registrationPeriodRepository;
    private final TuitionPolicyRepository tuitionPolicyRepository;
    private final CreditClassRepository creditClassRepository;
    private final SemesterScheduleRepository semesterScheduleRepository;
    private final FacultyRepository facultyRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final ClassroomRepository classroomRepository;

    public void seedAcademicData() {
        seedSemesters();
        seedRegistrationPeriods();
        seedTuitionPolicies();
        seedCreditClasses();
        log.info("Academic data seeding completed successfully.");
    }

    private void seedSemesters() {
        if (semesterRepository.count() == 0) {
            AcademicYear k65 = academicYearRepository.findById("K65").orElse(null);
            if (k65 == null) return;

            Semester hk2Previous = Semester.builder()
                    .name("Học kỳ 2 2025-2026")
                    .semesterCode("20252")
                    .academicYear(k65)
                    .startDate(LocalDate.of(2026, 1, 15))
                    .endDate(LocalDate.of(2026, 6, 15))
                    .active(false)
                    .build();
            semesterRepository.save(hk2Previous);

            Semester hk1 = Semester.builder()
                    .name("Học kỳ 1 2026-2027")
                    .semesterCode("20261")
                    .academicYear(k65)
                    .startDate(LocalDate.of(2026, 9, 1))
                    .endDate(LocalDate.of(2027, 1, 15))
                    .active(true)
                    .build();
            semesterRepository.save(hk1);

            Semester hk2 = Semester.builder()
                    .name("Học kỳ 2 2026-2027")
                    .semesterCode("20262")
                    .academicYear(k65)
                    .startDate(LocalDate.of(2027, 2, 1))
                    .endDate(LocalDate.of(2027, 6, 30))
                    .active(true)
                    .build();
            semesterRepository.save(hk2);
        }
    }

    private void seedRegistrationPeriods() {
        if (registrationPeriodRepository.count() == 0) {
            Semester hk1 = semesterRepository.findBySemesterCode("20261").orElse(null);
            if (hk1 != null) {
                RegistrationPeriod period = RegistrationPeriod.builder()
                        .name("Đợt 1 - Đăng ký tín chỉ chính thức HK1 2026-2027")
                        .semester(hk1)
                        .startTime(LocalDateTime.now().minusDays(2))
                        .endTime(LocalDateTime.now().plusDays(14))
                        .maxCreditsAllowed(24)
                        .active(true)
                        .build();
                registrationPeriodRepository.save(period);
            }
        }
    }

    private void seedTuitionPolicies() {
        if (tuitionPolicyRepository.count() == 0) {
            Semester hk1 = semesterRepository.findBySemesterCode("20261").orElse(null);
            Faculty cntt = facultyRepository.findById("CNTT").orElse(null);

            if (hk1 != null) {
                // Toàn trường: 450,000 VNĐ / tín chỉ
                tuitionPolicyRepository.save(TuitionPolicy.builder()
                        .semester(hk1)
                        .faculty(null)
                        .unitPricePerCredit(new BigDecimal("450000.00"))
                        .effectiveDate(LocalDate.of(2026, 9, 1))
                        .active(true)
                        .build());

                // Khoa CNTT: 500,000 VNĐ / tín chỉ
                if (cntt != null) {
                    tuitionPolicyRepository.save(TuitionPolicy.builder()
                            .semester(hk1)
                            .faculty(cntt)
                            .unitPricePerCredit(new BigDecimal("500000.00"))
                            .effectiveDate(LocalDate.of(2026, 9, 1))
                            .active(true)
                            .build());
                }
            }
        }
    }

    private void seedCreditClasses() {
        if (creditClassRepository.count() == 0) {
            Semester hk1 = semesterRepository.findBySemesterCode("20261").orElse(null);
            AcademicYear year = academicYearRepository.findById("K65").orElse(null);
            Teacher gv1 = teacherRepository.findById("GV001").orElse(null);
            Teacher gv2 = teacherRepository.findById("GV002").orElse(null);
            Teacher gv3 = teacherRepository.findById("GV003").orElse(null);
            Teacher gv4 = teacherRepository.findById("GV004").orElse(null);

            Classroom rA101 = classroomRepository.findById("A101").orElse(null);
            Classroom rA102 = classroomRepository.findById("A102").orElse(null);
            Classroom rB201 = classroomRepository.findById("B201").orElse(null);
            Classroom rB202 = classroomRepository.findById("B202").orElse(null);
            Classroom rC301 = classroomRepository.findById("C301").orElse(null);
            Classroom rC302 = classroomRepository.findById("C302").orElse(null);

            Subject subJava = subjectRepository.findById("JAVA01").orElse(null);
            Subject subDsa = subjectRepository.findById("DSA02").orElse(null);
            Subject subDb = subjectRepository.findById("DB03").orElse(null);
            Subject subSa = subjectRepository.findById("SA04").orElse(null);
            Subject subAi = subjectRepository.findById("AI05").orElse(null);
            Subject subNet = subjectRepository.findById("NET06").orElse(null);
            Subject subWeb = subjectRepository.findById("WEB07").orElse(null);

            if (hk1 != null && year != null) {
                createClassAndSchedule("Lớp Lập trình Java căn bản - Nhóm 01", subJava, gv1, rA101, year, hk1, "Thứ 2 (Tiết 1-3)", ClassShift.MORNING);
                createClassAndSchedule("Lớp Cấu trúc dữ liệu & GT - Nhóm 01", subDsa, gv1, rA102, year, hk1, "Thứ 3 (Tiết 4-6)", ClassShift.MORNING);
                createClassAndSchedule("Lớp Cơ sở dữ liệu - Nhóm 01", subDb, gv2, rB201, year, hk1, "Thứ 4 (Tiết 7-9)", ClassShift.AFTERNOON);
                createClassAndSchedule("Lớp Kiến trúc phần mềm - Nhóm 01", subSa, gv2, rB202, year, hk1, "Thứ 6 (Tiết 1-3)", ClassShift.MORNING);
                createClassAndSchedule("Lớp Trí tuệ nhân tạo - Nhóm 01", subAi, gv3, rC301, year, hk1, "Thứ 5 (Tiết 1-3)", ClassShift.MORNING);
                createClassAndSchedule("Lớp Mạng máy tính - Nhóm 01", subNet, gv4, rC302, year, hk1, "Thứ 5 (Tiết 7-9)", ClassShift.AFTERNOON);
                createClassAndSchedule("Lớp Phát triển Web - Nhóm 01", subWeb, gv1, rC301, year, hk1, "Thứ 6 (Tiết 7-9)", ClassShift.AFTERNOON);
            }
        }
    }

    private void createClassAndSchedule(String name, Subject sub, Teacher teacher, Classroom room,
                                        AcademicYear year, Semester sem, String studyTime, ClassShift shift) {
        if (sub == null || teacher == null || room == null) return;

        CreditClass cc = creditClassRepository.save(CreditClass.builder()
                .creditClassName(name)
                .subject(sub)
                .teacher(teacher)
                .classroom(room)
                .academicYear(year)
                .semester(sem)
                .maxStudents(40)
                .enrolledCount(0)
                .attendanceWeight(sub.getAttendanceWeight())
                .midtermWeight(sub.getMidtermWeight())
                .finalExamWeight(sub.getFinalExamWeight())
                .locked(false)
                .build());

        if (semesterScheduleRepository.findByCreditClass_CreditClassId(cc.getId()).isEmpty()) {
            semesterScheduleRepository.save(SemesterSchedule.builder()
                    .creditClass(cc)
                    .subject(sub)
                    .teacher(teacher)
                    .classroom(room)
                    .semester(com.student.management.enums.Semester.SEMESTER_1)
                    .academicYear(year.getAcademicYearId())
                    .studyTime(studyTime)
                    .classShift(shift)
                    .startDate(sem.getStartDate())
                    .endDate(sem.getEndDate())
                    .build());
        }
    }
}

