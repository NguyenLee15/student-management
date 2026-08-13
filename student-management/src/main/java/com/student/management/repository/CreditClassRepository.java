package com.student.management.repository;

import com.student.management.entity.CreditClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditClassRepository extends JpaRepository<CreditClass, Long> {
    @EntityGraph(attributePaths = {"subject"})
    Page<CreditClass> findAll(Pageable pageable);
}

