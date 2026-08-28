package com.student.management.repository;

import com.student.management.entity.StudentClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;


public interface StudentClassRepository extends JpaRepository<StudentClass, String> {

    @Query("SELECT sc FROM StudentClass sc WHERE sc.faculty.facultyId = :facultyId")
    List<StudentClass> findByFacultyId(@Param("facultyId") String facultyId);

    @Query("SELECT sc FROM StudentClass sc WHERE sc.faculty.facultyId = :facultyId")
    Page<StudentClass> findByFacultyId(@Param("facultyId") String facultyId, Pageable pageable);
}

