// cSpell:disable
package com.student.management.repository;

import com.student.management.entity.PaymentTransaction;
import com.student.management.enums.PaymentTransactionStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;


public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Optional<PaymentTransaction> findByOrderCode(Long orderCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM PaymentTransaction t WHERE t.orderCode = :orderCode")
    Optional<PaymentTransaction> findByOrderCodeForUpdate(@Param("orderCode") Long orderCode);

    @EntityGraph(attributePaths = {"student", "invoice"})
    List<PaymentTransaction> findByStudent_StudentIdOrderByCreatedAtDesc(String studentId);

    List<PaymentTransaction> findByInvoice_IdOrderByCreatedAtDesc(Long invoiceId);

    List<PaymentTransaction> findByStatusAndCreatedAtBefore(PaymentTransactionStatus status, LocalDateTime dateTime);
}

