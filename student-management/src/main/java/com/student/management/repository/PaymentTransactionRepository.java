package com.student.management.repository;

import com.student.management.entity.PaymentTransaction;
import com.student.management.enums.PaymentTransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Optional<PaymentTransaction> findByOrderCode(Long orderCode);

    List<PaymentTransaction> findByStudent_StudentIdOrderByCreatedAtDesc(String studentId);

    List<PaymentTransaction> findByInvoice_IdOrderByCreatedAtDesc(Long invoiceId);

    List<PaymentTransaction> findByStatusAndCreatedAtBefore(PaymentTransactionStatus status, LocalDateTime dateTime);
}

