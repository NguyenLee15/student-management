// cSpell:disable
package com.student.management.config.seeders;

import com.student.management.entity.*;
import com.student.management.enums.*;
import com.student.management.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class BaseDataSeeder {

    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;
    private final AcademicYearRepository academicYearRepository;
    private final StudentClassRepository studentClassRepository;
    private final ClassroomRepository classroomRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public void seedBaseData() {
        seedFaculties();
        seedAcademicYears();
        seedStudentClasses();
        seedClassrooms();
        seedSubjects();
        seedTeachers();
        seedStudents();
        seedUsers();
        log.info("Base data seeding completed successfully.");
    }

    private void seedUsers() {
        createUserIfNotExists("admin", "admin123", Role.ADMIN, null, null);
        createUserIfNotExists("teacher", "teacher123", Role.TEACHER, "GV001", null);
        createUserIfNotExists("teacher2", "teacher123", Role.TEACHER, "GV002", null);
        createUserIfNotExists("teacher3", "teacher123", Role.TEACHER, "GV003", null);
        createUserIfNotExists("teacher4", "teacher123", Role.TEACHER, "GV004", null);
        createUserIfNotExists("student", "student123", Role.STUDENT, null, "SV001");
        createUserIfNotExists("student2", "student123", Role.STUDENT, null, "SV002");
        createUserIfNotExists("student3", "student123", Role.STUDENT, null, "SV003");
        createUserIfNotExists("student4", "student123", Role.STUDENT, null, "SV004");
        createUserIfNotExists("student5", "student123", Role.STUDENT, null, "SV005");
        createUserIfNotExists("student6", "student123", Role.STUDENT, null, "SV006");
        createUserIfNotExists("student7", "student123", Role.STUDENT, null, "SV007");
        createUserIfNotExists("student8", "student123", Role.STUDENT, null, "SV008");
    }

    private void createUserIfNotExists(String username, String rawPassword, Role role, String teacherId, String studentId) {
        if (userRepository.findByUserName(username).isEmpty()) {
            User user = User.builder()
                    .userName(username)
                    .password(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .teacherId(teacherId)
                    .studentId(studentId)
                    .build();
            userRepository.save(user);
        }
    }

    private void seedFaculties() {
        if (facultyRepository.count() == 0) {
            facultyRepository.save(Faculty.builder().facultyId("CNTT").facultyName("Công nghệ thông tin").build());
            facultyRepository.save(Faculty.builder().facultyId("KTPM").facultyName("Kỹ thuật phần mềm").build());
            facultyRepository.save(Faculty.builder().facultyId("DTVT").facultyName("Điện tử viễn thông").build());
            facultyRepository.save(Faculty.builder().facultyId("QTKD").facultyName("Quản trị kinh doanh").build());
        }
    }

    private void seedAcademicYears() {
        if (academicYearRepository.count() == 0) {
            academicYearRepository.save(AcademicYear.builder().academicYearId("K64").academicYearName("2019-2023").build());
            academicYearRepository.save(AcademicYear.builder().academicYearId("K65").academicYearName("2020-2024").build());
            academicYearRepository.save(AcademicYear.builder().academicYearId("K66").academicYearName("2021-2025").build());
            academicYearRepository.save(AcademicYear.builder().academicYearId("K67").academicYearName("2022-2026").build());
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
        }
    }

    private void seedSubjects() {
        if (subjectRepository.count() == 0) {
            Faculty cntt = facultyRepository.findById("CNTT").orElse(null);
            Faculty ktpm = facultyRepository.findById("KTPM").orElse(null);
            Faculty dtvt = facultyRepository.findById("DTVT").orElse(null);

            Subject java = saveSubject("JAVA01", "Lập trình Java căn bản", SubjectType.MAJOR, 3, 500000, cntt, null, "0.10", "0.30", "0.60");
            Subject dsa = saveSubject("DSA02", "Cấu trúc dữ liệu & Giải thuật", SubjectType.MAJOR, 4, 500000, cntt, java, "0.20", "0.20", "0.60");
            Subject db = saveSubject("DB03", "Cơ sở dữ liệu", SubjectType.MAJOR, 3, 500000, cntt, null, "0.10", "0.30", "0.60");
            saveSubject("SA04", "Kiến trúc & Thiết kế phần mềm", SubjectType.SPECIALIZED, 3, 500000, ktpm, db, "0.10", "0.30", "0.60");
            Subject ai = saveSubject("AI05", "Trí tuệ nhân tạo", SubjectType.SPECIALIZED, 3, 500000, cntt, dsa, "0.10", "0.30", "0.60");
            saveSubject("NET06", "Mạng máy tính", SubjectType.BASIC, 3, 500000, dtvt, null, "0.10", "0.30", "0.60");
            saveSubject("WEB07", "Phát triển ứng dụng Web", SubjectType.MAJOR, 3, 500000, cntt, java, "0.10", "0.30", "0.60");
            saveSubject("ML08", "Học máy & Khai phá dữ liệu", SubjectType.SPECIALIZED, 3, 500000, cntt, ai, "0.20", "0.20", "0.60");
        }
    }

    private Subject saveSubject(String id, String name, SubjectType type, int credits, int tuition,
                                Faculty faculty, Subject prereq, String w1, String w2, String w3) {
        return subjectRepository.save(Subject.builder()
                .subjectId(id)
                .subjectName(name)
                .subjectType(type)
                .credits(credits)
                .tuitionPerCredit(tuition)
                .faculty(faculty)
                .prerequisiteSubject(prereq)
                .attendanceWeight(new BigDecimal(w1))
                .midtermWeight(new BigDecimal(w2))
                .finalExamWeight(new BigDecimal(w3))
                .build());
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
        }
    }

    private void seedStudents() {
        if (studentRepository.count() == 0) {
            StudentClass cntt1 = studentClassRepository.findById("CNTT1-K65").orElse(null);
            StudentClass ktpm1 = studentClassRepository.findById("KTPM1-K65").orElse(null);
            StudentClass cntt2 = studentClassRepository.findById("CNTT2-K65").orElse(null);
            StudentClass dtvt1 = studentClassRepository.findById("DTVT1-K66").orElse(null);
            StudentClass ktpm2 = studentClassRepository.findById("KTPM2-K65").orElse(null);
            StudentClass qtkd1 = studentClassRepository.findById("QTKD1-K66").orElse(null);

            AcademicYear k65 = academicYearRepository.findById("K65").orElse(null);
            AcademicYear k66 = academicYearRepository.findById("K66").orElse(null);

            saveStudent("SV001", "Nguyễn Hữu Đạt", LocalDate.of(2002, 5, 15), Gender.MALE, "dat.nh@student.edu.vn", cntt1, k65);
            saveStudent("SV002", "Trần Mai Phương", LocalDate.of(2002, 8, 20), Gender.FEMALE, "phuong.tm@student.edu.vn", ktpm1, k65);
            saveStudent("SV003", "Lê Quốc Cường", LocalDate.of(2003, 1, 10), Gender.MALE, "cuong.lq@student.edu.vn", cntt2, k65);
            saveStudent("SV004", "Vũ Thùy Linh", LocalDate.of(2003, 11, 25), Gender.FEMALE, "linh.vt@student.edu.vn", dtvt1, k66);
            saveStudent("SV005", "Hoàng Gia Bảo", LocalDate.of(2002, 3, 12), Gender.MALE, "bao.hg@student.edu.vn", cntt1, k65);
            saveStudent("SV006", "Phạm Thị Ngọc Anh", LocalDate.of(2002, 12, 5), Gender.FEMALE, "anh.ptn@student.edu.vn", ktpm2, k65);
            saveStudent("SV007", "Đặng Tuấn Anh", LocalDate.of(2002, 7, 18), Gender.MALE, "anh.dt@student.edu.vn", cntt2, k65);
            saveStudent("SV008", "Ngô Bích Thảo", LocalDate.of(2003, 9, 30), Gender.FEMALE, "thao.nb@student.edu.vn", qtkd1, k66);
        }
    }

    private void saveStudent(String id, String name, LocalDate dob, Gender gender, String email, StudentClass sc, AcademicYear ay) {
        if (sc != null && ay != null) {
            studentRepository.save(Student.builder()
                    .studentId(id)
                    .fullName(name)
                    .dateOfBirth(dob)
                    .gender(gender)
                    .email(email)
                    .studentClass(sc)
                    .academicYear(ay)
                    .build());
        }
    }
}

