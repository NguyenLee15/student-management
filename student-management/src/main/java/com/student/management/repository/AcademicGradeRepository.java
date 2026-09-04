// cSpell:disable
package com.student.management.repository;

import com.student.management.entity.AcademicGrade;
import com.student.management.enums.Semester;
import com.student.management.enums.StudyPhase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AcademicGradeRepository extends JpaRepository<AcademicGrade, Integer> {

    @EntityGraph(attributePaths = {"student", "subject"})
    Page<AcademicGrade> findAll(Pageable pageable);

    @Query("SELECT g FROM AcademicGrade g WHERE g.student.studentId = :studentId AND g.subject.subjectId = :subjectId AND g.semester = :semester AND g.academicYear = :academicYear AND g.studyPhase = :studyPhase")
    Optional<AcademicGrade> findExistingGrade(
            @Param("studentId") String studentId,
            @Param("subjectId") String subjectId,
            @Param("semester") Semester semester,
            @Param("academicYear") String academicYear,
            @Param("studyPhase") StudyPhase studyPhase
    );

    @EntityGraph(attributePaths = {"student", "subject"})
    @Query("SELECT g FROM AcademicGrade g WHERE g.student.studentId = :studentId")
    List<AcademicGrade> findByStudentId(@Param("studentId") String studentId);

    @EntityGraph(attributePaths = {"student", "subject"})
    @Query("SELECT g FROM AcademicGrade g WHERE g.student.studentId = :studentId AND g.subject.subjectId = :subjectId")
    List<AcademicGrade> findByStudentIdAndSubjectId(@Param("studentId") String studentId, @Param("subjectId") String subjectId);

    @EntityGraph(attributePaths = {"student", "subject"})
    @Query("SELECT g FROM AcademicGrade g WHERE " +
           "(:studentId IS NULL OR g.student.studentId = :studentId) AND " +
           "(:subjectId IS NULL OR g.subject.subjectId = :subjectId) AND " +
           "(:semester IS NULL OR g.semester = :semester) AND " +
           "(:academicYear IS NULL OR g.academicYear = :academicYear) AND " +
           "(:studyPhase IS NULL OR g.studyPhase = :studyPhase)")
    Page<AcademicGrade> searchAndFilter(
            @Param("studentId") String studentId,
            @Param("subjectId") String subjectId,
            @Param("semester") Semester semester,
            @Param("academicYear") String academicYear,
            @Param("studyPhase") StudyPhase studyPhase,
            Pageable pageable
    );

    @Query("SELECT COUNT(g), AVG(COALESCE(g.scoreScale10, 0.0)), " +
           "SUM(CASE WHEN g.scoreScale10 >= 4.0 THEN 1L ELSE 0L END), " +
           "SUM(CASE WHEN g.scoreScale10 >= 8.5 THEN 1L ELSE 0L END), " +
           "SUM(CASE WHEN g.scoreScale10 >= 7.0 AND g.scoreScale10 < 8.5 THEN 1L ELSE 0L END), " +
           "SUM(CASE WHEN g.scoreScale10 >= 5.5 AND g.scoreScale10 < 7.0 THEN 1L ELSE 0L END), " +
           "SUM(CASE WHEN g.scoreScale10 >= 4.0 AND g.scoreScale10 < 5.5 THEN 1L ELSE 0L END), " +
           "SUM(CASE WHEN g.scoreScale10 < 4.0 THEN 1L ELSE 0L END) " +
           "FROM AcademicGrade g")
    List<Object[]> getGradeAggregateStats();
}
