// cSpell:disable
package com.student.management.repository;

import com.student.management.entity.Enrollment;
import com.student.management.enums.EnrollmentStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;


public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Enrollment e WHERE e.id = :id")
    Optional<Enrollment> findByIdForUpdate(@Param("id") Long id);

    @EntityGraph(attributePaths = {"student", "creditClass", "creditClass.subject", "creditClass.teacher", "creditClass.classroom", "semester"})
    List<Enrollment> findByStudent_StudentIdAndSemester_IdAndStatus(String studentId, Long semesterId, EnrollmentStatus status);

    @EntityGraph(attributePaths = {"student", "creditClass", "creditClass.subject", "creditClass.teacher", "creditClass.classroom", "semester"})
    @Query("SELECT e FROM Enrollment e WHERE e.student.studentId = :studentId AND e.semester.id = :semesterId AND e.status = 'ENROLLED'")
    List<Enrollment> findActiveEnrollmentsByStudentAndSemester(@Param("studentId") String studentId, @Param("semesterId") Long semesterId);

    @Query("SELECT COALESCE(SUM(e.creditClass.subject.credits), 0) FROM Enrollment e WHERE e.student.studentId = :studentId AND e.semester.id = :semesterId AND e.status = 'ENROLLED'")
    Integer sumActiveCreditsByStudentAndSemester(@Param("studentId") String studentId, @Param("semesterId") Long semesterId);

    boolean existsByStudent_StudentIdAndCreditClass_CreditClassIdAndStatus(String studentId, Long creditClassId, EnrollmentStatus status);

    @Query("SELECT COUNT(e) > 0 FROM Enrollment e WHERE e.student.studentId = :studentId AND e.creditClass.subject.subjectId = :subjectId AND e.semester.id = :semesterId AND e.status = 'ENROLLED'")
    boolean existsActiveBySubjectAndSemester(@Param("studentId") String studentId, @Param("subjectId") String subjectId, @Param("semesterId") Long semesterId);

    @EntityGraph(attributePaths = {"student", "creditClass", "creditClass.subject", "semester"})
    List<Enrollment> findByCreditClass_CreditClassIdAndStatus(Long creditClassId, EnrollmentStatus status);
}
