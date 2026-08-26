package com.student.management.repository;

import com.student.management.entity.TuitionPolicy;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TuitionPolicyRepository extends JpaRepository<TuitionPolicy, Long> {

    @EntityGraph(attributePaths = {"semester", "faculty"})
    List<TuitionPolicy> findBySemester_Id(Long semesterId);

    // Ưu tiên 1: Chính sách riêng theo Khoa
    @EntityGraph(attributePaths = {"semester", "faculty"})
    @Query("SELECT p FROM TuitionPolicy p WHERE p.semester.id = :semesterId AND p.faculty.facultyId = :facultyId AND p.active = true AND p.effectiveDate <= :now ORDER BY p.effectiveDate DESC")
    List<TuitionPolicy> findFacultySpecificPolicy(@Param("semesterId") Long semesterId, @Param("facultyId") String facultyId, @Param("now") LocalDate now);

    // Ưu tiên 2: Chính sách chung toàn trường (faculty is null)
    @EntityGraph(attributePaths = {"semester", "faculty"})
    @Query("SELECT p FROM TuitionPolicy p WHERE p.semester.id = :semesterId AND p.faculty IS NULL AND p.active = true AND p.effectiveDate <= :now ORDER BY p.effectiveDate DESC")
    List<TuitionPolicy> findUniversityWidePolicy(@Param("semesterId") Long semesterId, @Param("now") LocalDate now);
}
