package com.example.student.management.repository;

import com.example.student.management.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {

    @Query("SELECT s FROM Student s WHERE " +
           "(:keyword IS NULL OR s.studentId LIKE %:keyword% OR s.fullName LIKE %:keyword%) AND " +
           "(:classId IS NULL OR s.studentClass.classId = :classId) AND " +
           "(:facultyId IS NULL OR s.studentClass.faculty.facultyId = :facultyId) AND " +
           "(:academicYearId IS NULL OR s.academicYear.academicYearId = :academicYearId)")
    Page<Student> searchAndFilter(
            @Param("keyword") String keyword,
            @Param("classId") String classId,
            @Param("facultyId") String facultyId,
            @Param("academicYearId") String academicYearId,
            Pageable pageable);

    List<Student> findByStudentClass_ClassId(String classId);
}
