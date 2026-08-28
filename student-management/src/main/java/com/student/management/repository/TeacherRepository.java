// cSpell:disable
package com.student.management.repository;

import com.student.management.entity.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;


public interface TeacherRepository extends JpaRepository<Teacher, String> {
    java.util.Optional<Teacher> findByEmail(String email);

    @Query("SELECT t FROM Teacher t WHERE t.faculty.facultyId = :facultyId")
    List<Teacher> findByFacultyId(@Param("facultyId") String facultyId);

    @Query("SELECT t FROM Teacher t WHERE " +
           "(:keyword IS NULL OR LOWER(t.teacherId) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:facultyId IS NULL OR t.faculty.facultyId = :facultyId)")
    Page<Teacher> searchAndFilter(
            @Param("keyword") String keyword,
            @Param("facultyId") String facultyId,
            Pageable pageable
    );
}

