// cSpell:disable
package com.student.management.repository;

import com.student.management.entity.Subject;
import com.student.management.enums.SubjectType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;


public interface SubjectRepository extends JpaRepository<Subject, String> {

    @Query("SELECT s FROM Subject s WHERE s.subjectType = :subjectType")
    Page<Subject> findBySubjectType(@Param("subjectType") SubjectType subjectType, Pageable pageable);

    @Query("SELECT s FROM Subject s WHERE s.faculty.facultyId = :facultyId")
    Page<Subject> findByFacultyId(@Param("facultyId") String facultyId, Pageable pageable);

    @Query("SELECT s FROM Subject s WHERE s.faculty.facultyId = :facultyId")
    List<Subject> findByFacultyId(@Param("facultyId") String facultyId);
}

