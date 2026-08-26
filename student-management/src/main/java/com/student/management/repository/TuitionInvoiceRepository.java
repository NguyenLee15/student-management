package com.student.management.repository;

import com.student.management.entity.TuitionInvoice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TuitionInvoiceRepository extends JpaRepository<TuitionInvoice, Long> {

    @EntityGraph(attributePaths = {"student", "semester", "items", "items.creditClass", "items.creditClass.subject", "payments"})
    Optional<TuitionInvoice> findByStudent_StudentIdAndSemester_Id(String studentId, Long semesterId);

    @EntityGraph(attributePaths = {"student", "semester", "items", "items.creditClass", "items.creditClass.subject", "payments"})
    List<TuitionInvoice> findByStudent_StudentIdOrderByDueDateDesc(String studentId);

    Optional<TuitionInvoice> findByInvoiceCode(String invoiceCode);
}
