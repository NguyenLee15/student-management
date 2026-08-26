package com.student.management.repository;

import com.student.management.entity.TuitionPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TuitionPaymentRepository extends JpaRepository<TuitionPayment, Long> {
    List<TuitionPayment> findByInvoice_Id(Long invoiceId);
    Optional<TuitionPayment> findByTransactionCode(String transactionCode);
}
