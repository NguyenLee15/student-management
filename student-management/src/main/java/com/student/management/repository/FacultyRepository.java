package com.student.management.repository;

import com.student.management.entity.Faculty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



public interface FacultyRepository extends JpaRepository<Faculty, String> {

    @Query("SELECT f FROM Faculty f WHERE :keyword IS NULL OR LOWER(f.facultyId) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(f.facultyName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Faculty> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}

