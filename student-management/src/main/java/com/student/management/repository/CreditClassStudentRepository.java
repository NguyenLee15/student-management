package com.student.management.repository;

import com.student.management.entity.CreditClassStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;


public interface CreditClassStudentRepository extends JpaRepository<CreditClassStudent, Long> {

    @Query("SELECT ccs FROM CreditClassStudent ccs WHERE ccs.creditClass.creditClassId = :creditClassId")
    List<CreditClassStudent> findByCreditClassId(@Param("creditClassId") Long creditClassId);

    @Query("SELECT ccs FROM CreditClassStudent ccs WHERE ccs.student.studentId = :studentId")
    List<CreditClassStudent> findByStudentId(@Param("studentId") String studentId);
}

