// cSpell:disable
package com.student.management.config.seeders;

import com.student.management.entity.*;
import com.student.management.enums.EnrollmentStatus;
import com.student.management.enums.StudyPhase;
import com.student.management.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class EnrollmentAndGradeSeeder {

    private final AcademicGradeRepository academicGradeRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CreditClassRepository creditClassRepository;
    private final CreditClassStudentRepository creditClassStudentRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final SemesterRepository semesterRepository;

    public void seedEnrollmentsAndGrades() {
        seedHistoricalGrades();
        seedCurrentEnrollmentsAndRosters();
        seedCurrentGradesForTeacherDemo();
        log.info("Enrollment and Grade seeding completed successfully.");
    }

    private void seedHistoricalGrades() {
        if (academicGradeRepository.count() == 0) {
            Student sv1 = studentRepository.findById("SV001").orElse(null);
            Student sv2 = studentRepository.findById("SV002").orElse(null);
            Student sv3 = studentRepository.findById("SV003").orElse(null);
            Student sv4 = studentRepository.findById("SV004").orElse(null);
            Student sv5 = studentRepository.findById("SV005").orElse(null);

            Subject java = subjectRepository.findById("JAVA01").orElse(null);
            Subject db = subjectRepository.findById("DB03").orElse(null);
            Subject net = subjectRepository.findById("NET06").orElse(null);

            if (java != null && db != null && net != null) {
                // SV001: Passed JAVA, DB, NET with high distinction (GPA 3.67)
                saveGrade(sv1, java, com.student.management.enums.Semester.SEMESTER_2, "2025-2026", StudyPhase.PHASE_1, "9.0", "8.5", "8.5", "8.6", "4.0", "A");
                saveGrade(sv1, db, com.student.management.enums.Semester.SEMESTER_2, "2025-2026", StudyPhase.PHASE_1, "8.5", "8.0", "8.0", "8.1", "3.5", "B+");
                saveGrade(sv1, net, com.student.management.enums.Semester.SEMESTER_2, "2025-2026", StudyPhase.PHASE_1, "9.0", "7.5", "8.0", "8.0", "3.5", "B+");

                // SV002: Passed JAVA and DB
                saveGrade(sv2, java, com.student.management.enums.Semester.SEMESTER_2, "2025-2026", StudyPhase.PHASE_1, "8.5", "8.0", "7.5", "7.8", "3.0", "B");
                saveGrade(sv2, db, com.student.management.enums.Semester.SEMESTER_2, "2025-2026", StudyPhase.PHASE_1, "9.0", "8.5", "8.5", "8.6", "4.0", "A");

                // SV003: Passed JAVA and DB
                saveGrade(sv3, java, com.student.management.enums.Semester.SEMESTER_2, "2025-2026", StudyPhase.PHASE_1, "8.0", "7.0", "7.5", "7.4", "3.0", "B");
                saveGrade(sv3, db, com.student.management.enums.Semester.SEMESTER_2, "2025-2026", StudyPhase.PHASE_1, "7.0", "6.5", "6.0", "6.3", "2.0", "C");

                // SV004: Passed JAVA
                saveGrade(sv4, java, com.student.management.enums.Semester.SEMESTER_2, "2025-2026", StudyPhase.PHASE_1, "8.0", "6.0", "5.0", "5.6", "2.0", "C");

                // SV005: Passed JAVA and DB
                saveGrade(sv5, java, com.student.management.enums.Semester.SEMESTER_2, "2025-2026", StudyPhase.PHASE_1, "9.5", "9.0", "9.5", "9.4", "4.0", "A");
                saveGrade(sv5, db, com.student.management.enums.Semester.SEMESTER_2, "2025-2026", StudyPhase.PHASE_1, "9.0", "9.0", "9.0", "9.0", "4.0", "A");
            }
        }
    }

    private void seedCurrentEnrollmentsAndRosters() {
        if (enrollmentRepository.count() == 0) {
            Semester sem20261 = semesterRepository.findBySemesterCode("20261").orElse(null);
            if (sem20261 == null) return;

            List<CreditClass> classes = creditClassRepository.findAll();
            CreditClass classDsa = findClassBySubjectId(classes, "DSA02");
            CreditClass classWeb = findClassBySubjectId(classes, "WEB07");
            CreditClass classAi = findClassBySubjectId(classes, "AI05");
            CreditClass classJava = findClassBySubjectId(classes, "JAVA01");
            CreditClass classDb = findClassBySubjectId(classes, "DB03");

            // Enroll SV001, SV002, SV003, SV005 in DSA02 & WEB07
            enrollStudentInClass("SV001", classDsa, sem20261);
            enrollStudentInClass("SV002", classDsa, sem20261);
            enrollStudentInClass("SV003", classDsa, sem20261);
            enrollStudentInClass("SV005", classDsa, sem20261);

            enrollStudentInClass("SV001", classWeb, sem20261);
            enrollStudentInClass("SV002", classWeb, sem20261);
            enrollStudentInClass("SV003", classWeb, sem20261);
            enrollStudentInClass("SV005", classWeb, sem20261);

            // Enroll SV001, SV005 in AI05
            enrollStudentInClass("SV001", classAi, sem20261);
            enrollStudentInClass("SV005", classAi, sem20261);

            // Enroll SV004, SV006, SV007, SV008 in JAVA01 & DB03
            enrollStudentInClass("SV004", classJava, sem20261);
            enrollStudentInClass("SV006", classJava, sem20261);
            enrollStudentInClass("SV007", classJava, sem20261);
            enrollStudentInClass("SV008", classJava, sem20261);

            enrollStudentInClass("SV004", classDb, sem20261);
            enrollStudentInClass("SV006", classDb, sem20261);
            enrollStudentInClass("SV007", classDb, sem20261);
            enrollStudentInClass("SV008", classDb, sem20261);
        }
    }

    private void seedCurrentGradesForTeacherDemo() {
        Subject dsa = subjectRepository.findById("DSA02").orElse(null);
        if (dsa == null) return;

        Student sv1 = studentRepository.findById("SV001").orElse(null);
        Student sv2 = studentRepository.findById("SV002").orElse(null);
        Student sv3 = studentRepository.findById("SV003").orElse(null);
        Student sv5 = studentRepository.findById("SV005").orElse(null);

        // Grade entries for current semester (2026-2027 SEMESTER_1) for DSA02
        if (academicGradeRepository.findExistingGrade("SV001", "DSA02", com.student.management.enums.Semester.SEMESTER_1, "2026-2027", StudyPhase.PHASE_1).isEmpty()) {
            saveGrade(sv1, dsa, com.student.management.enums.Semester.SEMESTER_1, "2026-2027", StudyPhase.PHASE_1, "9.5", "8.5", "9.0", "8.9", "4.0", "A");
            saveGrade(sv2, dsa, com.student.management.enums.Semester.SEMESTER_1, "2026-2027", StudyPhase.PHASE_1, "9.0", "8.0", "8.0", "8.2", "3.5", "B+");
            saveGrade(sv3, dsa, com.student.management.enums.Semester.SEMESTER_1, "2026-2027", StudyPhase.PHASE_1, "8.5", "7.0", "7.5", "7.5", "3.0", "B");
            saveGrade(sv5, dsa, com.student.management.enums.Semester.SEMESTER_1, "2026-2027", StudyPhase.PHASE_1, "10.0", "9.5", "9.5", "9.6", "4.0", "A");
        }
    }

    private CreditClass findClassBySubjectId(List<CreditClass> list, String subjectId) {
        return list.stream()
                .filter(c -> c.getSubject() != null && subjectId.equals(c.getSubject().getSubjectId()))
                .findFirst()
                .orElse(null);
    }

    private void enrollStudentInClass(String studentId, CreditClass cc, Semester sem) {
        if (cc == null || sem == null) return;
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) return;

        Enrollment enrollment = enrollmentRepository.save(Enrollment.builder()
                .student(student)
                .creditClass(cc)
                .semester(sem)
                .enrollmentDate(LocalDateTime.now().minusDays(1))
                .status(EnrollmentStatus.ENROLLED)
                .build());

        creditClassStudentRepository.save(CreditClassStudent.builder()
                .student(student)
                .creditClass(cc)
                .build());

        cc.setEnrolledCount(cc.getEnrolledCount() + 1);
        creditClassRepository.save(cc);
    }

    private void saveGrade(Student student, Subject subject, com.student.management.enums.Semester sem,
                           String year, StudyPhase phase, String att, String mid, String fin,
                           String s10, String s4, String letter) {
        if (student == null || subject == null) return;

        academicGradeRepository.save(AcademicGrade.builder()
                .student(student)
                .subject(subject)
                .semester(sem)
                .academicYear(year)
                .studyPhase(phase)
                .attemptNumber(1)
                .attendanceScore(new BigDecimal(att))
                .midtermScore(new BigDecimal(mid))
                .finalExamScore(new BigDecimal(fin))
                .scoreScale10(new BigDecimal(s10))
                .scoreScale4(new BigDecimal(s4))
                .letterGrade(letter)
                .build());
    }
}

