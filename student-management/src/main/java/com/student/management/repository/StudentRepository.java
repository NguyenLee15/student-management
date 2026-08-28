// cSpell:disable
package com.student.management.repository;

import com.student.management.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;


public interface StudentRepository extends JpaRepository<Student, String> {
    java.util.Optional<Student> findByEmail(String email);

    @EntityGraph(attributePaths = {"studentClass", "academicYear", "studentClass.faculty"})
    @org.springframework.lang.NonNull
    Page<Student> findAll(@org.springframework.lang.NonNull Pageable pageable);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Student s WHERE s.studentId = :studentId")
    java.util.Optional<Student> findByIdForUpdate(@Param("studentId") String studentId);

    @Query("SELECT s FROM Student s WHERE s.studentClass.classId = :classId")
    List<Student> findByClassId(@Param("classId") String classId);

    @Query("SELECT ccs.student FROM CreditClassStudent ccs WHERE ccs.creditClass.creditClassId = :creditClassId")
    List<Student> findByCreditClassId(@Param("creditClassId") Long creditClassId);

    @Query("SELECT s FROM Student s WHERE " +
           "(:keyword IS NULL OR LOWER(s.studentId) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:classId IS NULL OR s.studentClass.classId = :classId) AND " +
           "(:facultyId IS NULL OR s.studentClass.faculty.facultyId = :facultyId) AND " +
           "(:academicYearId IS NULL OR s.academicYear.academicYearId = :academicYearId)")
    @EntityGraph(attributePaths = {"studentClass", "academicYear", "studentClass.faculty"})
    Page<Student> searchAndFilterStudents(
            @Param("keyword") String keyword,
            @Param("classId") String classId,
            @Param("facultyId") String facultyId,
            @Param("academicYearId") String academicYearId,
            Pageable pageable
    );
}

