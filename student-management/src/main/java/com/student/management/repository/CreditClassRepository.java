// cSpell:disable
package com.student.management.repository;

import com.student.management.entity.CreditClass;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;


public interface CreditClassRepository extends JpaRepository<CreditClass, Long> {

    @EntityGraph(attributePaths = {"subject", "teacher", "classroom"})
    @org.springframework.lang.NonNull
    Page<CreditClass> findAll(@org.springframework.lang.NonNull Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM CreditClass c WHERE c.creditClassId = :id")
    Optional<CreditClass> findByIdForUpdate(@Param("id") Long id);

    @EntityGraph(attributePaths = {"subject", "teacher", "classroom"})
    @Query("SELECT c FROM CreditClass c WHERE c.teacher.teacherId = :teacherId")
    List<CreditClass> findByTeacherId(@Param("teacherId") String teacherId);

    @EntityGraph(attributePaths = {"subject", "teacher", "classroom"})
    @Query("SELECT c FROM CreditClass c WHERE c.semester.id = :semesterId")
    List<CreditClass> findBySemesterId(@Param("semesterId") Long semesterId);
}
