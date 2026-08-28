package com.student.management.repository;

import com.student.management.entity.Semester;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.Optional;


public interface SemesterRepository extends JpaRepository<Semester, Long> {

    @EntityGraph(attributePaths = {"academicYear"})
    Optional<Semester> findBySemesterCode(String semesterCode);

    @EntityGraph(attributePaths = {"academicYear"})
    List<Semester> findByAcademicYear_AcademicYearId(String academicYearId);

    @EntityGraph(attributePaths = {"academicYear"})
    @Query("SELECT s FROM Semester s WHERE s.active = true ORDER BY s.startDate DESC")
    List<Semester> findAllActiveSemesters();
}
