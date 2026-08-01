package com.example.student.management.repository;

import com.example.student.management.entity.StudentClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentClassRepository extends JpaRepository<StudentClass, String> {
    Page<StudentClass> findByFaculty_FacultyId(String facultyId, Pageable pageable);
}
