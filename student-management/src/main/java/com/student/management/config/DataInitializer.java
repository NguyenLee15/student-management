// cSpell:disable
package com.student.management.config;

import com.student.management.entity.*;
import com.student.management.entity.Semester;
import com.student.management.enums.*;
import com.student.management.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import org.springframework.transaction.annotation.Transactional;


@Component

@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;
    private final AcademicYearRepository academicYearRepository;
    private final StudentClassRepository studentClassRepository;
    private final ClassroomRepository classroomRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final SemesterRepository semesterRepository;
    private final RegistrationPeriodRepository registrationPeriodRepository;
    private final TuitionPolicyRepository tuitionPolicyRepository;
    private final CreditClassRepository creditClassRepository;
    private final SemesterScheduleRepository semesterScheduleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedFaculties();
        seedAcademicYears();
        seedStudentClasses();
        seedClassrooms();
        seedSubjects();
        seedTeachers();
        seedStudents();
        seedSemesters();
        seedRegistrationPeriods();
        seedTuitionPolicies();
        seedCreditClasses();
        logger.info("✅ Comprehensive Data Seeding completed successfully for EduPortal AI!");
    }

    private void seedUsers() {

        if (userRepository.findByUserName("admin").isEmpty()) {
            User admin = User.builder()
                    .userName("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            logger.info("Initialized default ADMIN user (admin / admin123)");
        }

        if (userRepository.findByUserName("teacher").isEmpty()) {
            User teacher = User.builder()
                    .userName("teacher")
                    .password(passwordEncoder.encode("teacher123"))
                    .role(Role.TEACHER)
                    .teacherId("GV001")
                    .build();
            userRepository.save(teacher);
            logger.info("Initialized default TEACHER user (teacher / teacher123, teacherId: GV001)");
        }

        if (userRepository.findByUserName("student").isEmpty()) {
            User student = User.builder()
                    .userName("student")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .studentId("SV001")
                    .build();
            userRepository.save(student);
            logger.info("Initialized default STUDENT user (student / student123, studentId: SV001)");
        }
    }

    private void seedFaculties() {
        if (facultyRepository.count() == 0) {
            facultyRepository.save(Faculty.builder().facultyId("CNTT").facultyName("Công nghệ thông tin").build());
            facultyRepository.save(Faculty.builder().facultyId("KTPM").facultyName("Kỹ thuật phần mềm").build());
            facultyRepository.save(Faculty.builder().facultyId("DTVT").facultyName("Điện tử viễn thông").build());
            facultyRepository.save(Faculty.builder().facultyId("QTKD").facultyName("Quản trị kinh doanh").build());
            logger.info("Initialized 4 Faculties (CNTT, KTPM, DTVT, QTKD)");
        }
    }

    private void seedAcademicYears() {
        if (academicYearRepository.count() == 0) {
            academicYearRepository.save(AcademicYear.builder().academicYearId("K64").academicYearName("2019-2023").build());
            academicYearRepository.save(AcademicYear.builder().academicYearId("K65").academicYearName("2020-2024").build());
            academicYearRepository.save(AcademicYear.builder().academicYearId("K66").academicYearName("2021-2025").build());
            logger.info("Initialized 3 Academic Years (K64, K65, K66)");
        }
    }

    private void seedStudentClasses() {
        if (studentClassRepository.count() == 0) {
            Faculty cntt = facultyRepository.findById("CNTT").orElse(null);
            Faculty ktpm = facultyRepository.findById("KTPM").orElse(null);
            Faculty dtvt = facultyRepository.findById("DTVT").orElse(null);
            Faculty qtkd = facultyRepository.findById("QTKD").orElse(null);

            if (cntt != null) {
                studentClassRepository.save(StudentClass.builder().classId("CNTT1-K65").className("Lớp CNTT 1 - K65").faculty(cntt).build());
                studentClassRepository.save(StudentClass.builder().classId("CNTT2-K65").className("Lớp CNTT 2 - K65").faculty(cntt).build());
            }
            if (ktpm != null) {
                studentClassRepository.save(StudentClass.builder().classId("KTPM1-K65").className("Lớp KTPM 1 - K65").faculty(ktpm).build());
                studentClassRepository.save(StudentClass.builder().classId("KTPM2-K65").className("Lớp KTPM 2 - K65").faculty(ktpm).build());
            }
            if (dtvt != null) {
                studentClassRepository.save(StudentClass.builder().classId("DTVT1-K66").className("Lớp ĐTVT 1 - K66").faculty(dtvt).build());
            }
            if (qtkd != null) {
                studentClassRepository.save(StudentClass.builder().classId("QTKD1-K66").className("Lớp QTKD 1 - K66").faculty(qtkd).build());
            }
            logger.info("Initialized 6 Student Classes");
        }
    }

    private void seedClassrooms() {
        if (classroomRepository.count() == 0) {
            classroomRepository.save(Classroom.builder().roomId("A101").roomName("Phòng A101 Lý thuyết").capacity(60).building(Building.A).build());
            classroomRepository.save(Classroom.builder().roomId("A102").roomName("Phòng A102 Lý thuyết").capacity(60).building(Building.A).build());
            classroomRepository.save(Classroom.builder().roomId("B201").roomName("Phòng B201 Đa năng").capacity(80).building(Building.B).build());
            classroomRepository.save(Classroom.builder().roomId("B202").roomName("Phòng B202 Đa năng").capacity(80).building(Building.B).build());
            classroomRepository.save(Classroom.builder().roomId("C301").roomName("Phòng Lab C301 Máy tính").capacity(40).building(Building.C).build());
            classroomRepository.save(Classroom.builder().roomId("C302").roomName("Phòng Lab C302 Máy tính").capacity(40).building(Building.C).build());
            logger.info("Initialized 6 Classrooms across Buildings A, B, C");
        }
    }

    private void seedSubjects() {
        if (subjectRepository.count() == 0) {
            Faculty cntt = facultyRepository.findById("CNTT").orElse(null);
            Faculty ktpm = facultyRepository.findById("KTPM").orElse(null);
            Faculty dtvt = facultyRepository.findById("DTVT").orElse(null);

            if (cntt != null) {
                subjectRepository.save(Subject.builder()
                        .subjectId("JAVA01")
                        .subjectName("Lập trình Java căn bản")
                        .credits(3)
                        .tuitionPerCredit(500000)
                        .subjectType(SubjectType.MAJOR)
                        .faculty(cntt)
                        .build());

                subjectRepository.save(Subject.builder()
                        .subjectId("DSA02")
                        .subjectName("Cấu trúc dữ liệu & Giải thuật")
                        .credits(4)
                        .tuitionPerCredit(500000)
                        .subjectType(SubjectType.MAJOR)
                        .faculty(cntt)
                        .build());

                subjectRepository.save(Subject.builder()
                        .subjectId("DB03")
                        .subjectName("Cơ sở dữ liệu")
                        .credits(3)
                        .tuitionPerCredit(500000)
                        .subjectType(SubjectType.MAJOR)
                        .faculty(cntt)
                        .build());

                subjectRepository.save(Subject.builder()
                        .subjectId("AI05")
                        .subjectName("Trí tuệ nhân tạo")
                        .credits(3)
                        .tuitionPerCredit(500000)
                        .subjectType(SubjectType.SPECIALIZED)
                        .faculty(cntt)
                        .build());
            }

            if (ktpm != null) {
                subjectRepository.save(Subject.builder()
                        .subjectId("SA04")
                        .subjectName("Kiến trúc & Thiết kế phần mềm")
                        .credits(3)
                        .tuitionPerCredit(500000)
                        .subjectType(SubjectType.SPECIALIZED)
                        .faculty(ktpm)
                        .build());
            }

            if (dtvt != null) {
                subjectRepository.save(Subject.builder()
                        .subjectId("NET06")
                        .subjectName("Mạng máy tính")
                        .credits(3)
                        .tuitionPerCredit(500000)
                        .subjectType(SubjectType.BASIC)
                        .faculty(dtvt)
                        .build());
            }
            logger.info("Initialized 6 Subjects");
        }
    }

    private void seedTeachers() {
        if (teacherRepository.count() == 0) {
            Faculty cntt = facultyRepository.findById("CNTT").orElse(null);
            Faculty ktpm = facultyRepository.findById("KTPM").orElse(null);
            Faculty dtvt = facultyRepository.findById("DTVT").orElse(null);

            if (cntt != null) {
                teacherRepository.save(Teacher.builder().teacherId("GV001").fullName("TS. Nguyễn Văn An").email("nguyenvanan@university.edu.vn").faculty(cntt).build());
                teacherRepository.save(Teacher.builder().teacherId("GV003").fullName("PGS.TS. Lê Hoàng Nam").email("lehoangnam@university.edu.vn").faculty(cntt).build());
            }
            if (ktpm != null) {
                teacherRepository.save(Teacher.builder().teacherId("GV002").fullName("ThS. Trần Thị Bích").email("tranthibich@university.edu.vn").faculty(ktpm).build());
            }
            if (dtvt != null) {
                teacherRepository.save(Teacher.builder().teacherId("GV004").fullName("ThS. Phạm Minh Tuấn").email("phamminhtuan@university.edu.vn").faculty(dtvt).build());
            }
            logger.info("Initialized 4 Teachers");
        }
    }

    private void seedStudents() {
        if (studentRepository.count() == 0) {
            StudentClass cntt1 = studentClassRepository.findById("CNTT1-K65").orElse(null);
            StudentClass ktpm1 = studentClassRepository.findById("KTPM1-K65").orElse(null);
            StudentClass cntt2 = studentClassRepository.findById("CNTT2-K65").orElse(null);
            StudentClass dtvt1 = studentClassRepository.findById("DTVT1-K66").orElse(null);

            AcademicYear k65 = academicYearRepository.findById("K65").orElse(null);
            AcademicYear k66 = academicYearRepository.findById("K66").orElse(null);

            if (cntt1 != null && k65 != null) {
                studentRepository.save(Student.builder()
                        .studentId("SV001")
                        .fullName("Nguyễn Hữu Đạt")
                        .dateOfBirth(LocalDate.of(2002, 5, 15))
                        .gender(Gender.MALE)
                        .email("dat.nh@student.edu.vn")
                        .studentClass(cntt1)
                        .academicYear(k65)
                        .build());
            }

            if (ktpm1 != null && k65 != null) {
                studentRepository.save(Student.builder()
                        .studentId("SV002")
                        .fullName("Trần Mai Phương")
                        .dateOfBirth(LocalDate.of(2002, 8, 20))
                        .gender(Gender.FEMALE)
                        .email("phuong.tm@student.edu.vn")
                        .studentClass(ktpm1)
                        .academicYear(k65)
                        .build());
            }

            if (cntt2 != null && k65 != null) {
                studentRepository.save(Student.builder()
                        .studentId("SV003")
                        .fullName("Lê Quốc Cường")
                        .dateOfBirth(LocalDate.of(2003, 1, 10))
                        .gender(Gender.MALE)
                        .email("cuong.lq@student.edu.vn")
                        .studentClass(cntt2)
                        .academicYear(k65)
                        .build());
            }

            if (dtvt1 != null && k66 != null) {
                studentRepository.save(Student.builder()
                        .studentId("SV004")
                        .fullName("Vũ Thùy Linh")
                        .dateOfBirth(LocalDate.of(2003, 11, 25))
                        .gender(Gender.FEMALE)
                        .email("linh.vt@student.edu.vn")
                        .studentClass(dtvt1)
                        .academicYear(k66)
                        .build());
            }
            logger.info("Initialized 4 Sample Students");
        }
    }

    private void seedSemesters() {
        if (semesterRepository.count() == 0) {
            AcademicYear k65 = academicYearRepository.findById("K65").orElse(null);
            AcademicYear year = k65 != null ? k65 : academicYearRepository.findAll().stream().findFirst().orElse(null);

            if (year != null) {
                Semester hk1 = Semester.builder()
                        .name("Học kỳ 1 2026-2027")
                        .semesterCode("20261")
                        .academicYear(year)
                        .startDate(LocalDate.of(2026, 9, 1))
                        .endDate(LocalDate.of(2027, 1, 15))
                        .active(true)
                        .build();
                semesterRepository.save(hk1);

                Semester hk2 = Semester.builder()
                        .name("Học kỳ 2 2026-2027")
                        .semesterCode("20262")
                        .academicYear(year)
                        .startDate(LocalDate.of(2027, 2, 1))
                        .endDate(LocalDate.of(2027, 6, 30))
                        .active(true)
                        .build();
                semesterRepository.save(hk2);

                logger.info("Initialized 2 Semesters (HK1 & HK2 2026-2027)");
            }
        }
    }

    private void seedRegistrationPeriods() {
        if (registrationPeriodRepository.count() == 0) {
            Semester hk1 = semesterRepository.findBySemesterCode("20261").orElse(null);
            if (hk1 != null) {
                RegistrationPeriod period = RegistrationPeriod.builder()
                        .name("Đợt 1 - Đăng ký tín chỉ chính thức HK1 2026-2027")
                        .semester(hk1)
                        .startTime(java.time.LocalDateTime.now().minusDays(2))
                        .endTime(java.time.LocalDateTime.now().plusDays(14))
                        .maxCreditsAllowed(24)
                        .active(true)
                        .build();
                registrationPeriodRepository.save(period);
                logger.info("Initialized active RegistrationPeriod for HK1");
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
                        .unitPricePerCredit(new java.math.BigDecimal("450000.00"))
                        .effectiveDate(LocalDate.of(2026, 9, 1))
                        .active(true)
                        .build());

                // Khoa CNTT chất lượng cao: 500,000 VNĐ / tín chỉ
                if (cntt != null) {
                    tuitionPolicyRepository.save(TuitionPolicy.builder()
                            .semester(hk1)
                            .faculty(cntt)
                            .unitPricePerCredit(new java.math.BigDecimal("500000.00"))
                            .effectiveDate(LocalDate.of(2026, 9, 1))
                            .active(true)
                            .build());
                }
                logger.info("Initialized TuitionPolicies (Universal 450k & CNTT 500k)");
            }
        }
    }

    private void seedCreditClasses() {
        if (creditClassRepository.count() == 0) {
            Semester hk1 = semesterRepository.findBySemesterCode("20261").orElse(null);
            AcademicYear year = academicYearRepository.findAll().stream().findFirst().orElse(null);
            Teacher gv1 = teacherRepository.findById("GV001").orElse(null);
            Teacher gv2 = teacherRepository.findById("GV002").orElse(null);
            Classroom cr1 = classroomRepository.findAll().stream().findFirst().orElse(null);

            Subject javaSub = subjectRepository.findById("JAVA01").orElse(null);
            Subject dsaSub = subjectRepository.findById("DSA02").orElse(null);
            Subject dbSub = subjectRepository.findById("DB03").orElse(null);
            Subject netSub = subjectRepository.findById("NET06").orElse(null);

            if (hk1 != null && year != null && gv1 != null && cr1 != null && javaSub != null) {
                seedOneCreditClass("Lớp Java căn bản - Nhóm 01", javaSub, gv1, cr1, year, hk1,
                        "Thứ 2 (Tiết 1-3)", ClassShift.MORNING, "0.10", "0.30", "0.60");

                if (dsaSub != null) {
                    seedOneCreditClass("Lớp Cấu trúc dữ liệu - Nhóm 01", dsaSub, gv1, cr1, year, hk1,
                            "Thứ 3 (Tiết 4-6)", ClassShift.MORNING, "0.20", "0.20", "0.60");
                }

                if (dbSub != null && gv2 != null) {
                    seedOneCreditClass("Lớp Cơ sở dữ liệu - Nhóm 01", dbSub, gv2, cr1, year, hk1,
                            "Thứ 4 (Tiết 7-9)", ClassShift.AFTERNOON, "0.10", "0.30", "0.60");
                }

                if (netSub != null) {
                    seedOneCreditClass("Lớp Mạng máy tính - Nhóm 01", netSub, gv1, cr1, year, hk1,
                            "Thứ 5 (Tiết 7-9)", ClassShift.AFTERNOON, "0.10", "0.30", "0.60");
                }
                logger.info("Initialized 4 sample CreditClasses with schedules and snapshot weights");
            }
        }
    }

    private void seedOneCreditClass(String name, Subject sub, Teacher teacher, Classroom cr, AcademicYear year, Semester sem,
                                    String studyTime, ClassShift shift, String w1, String w2, String w3) {
        CreditClass cc = creditClassRepository.save(CreditClass.builder()
                .creditClassName(name)
                .subject(sub)
                .teacher(teacher)
                .classroom(cr)
                .academicYear(year)
                .semester(sem)
                .maxStudents(40)
                .enrolledCount(0)
                .attendanceWeight(new java.math.BigDecimal(w1))
                .midtermWeight(new java.math.BigDecimal(w2))
                .finalExamWeight(new java.math.BigDecimal(w3))
                .locked(false)
                .build());

        if (semesterScheduleRepository.findByCreditClass_CreditClassId(cc.getId()).isEmpty()) {
            semesterScheduleRepository.save(SemesterSchedule.builder()
                    .creditClass(cc)
                    .subject(sub)
                    .teacher(teacher)
                    .classroom(cr)
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

