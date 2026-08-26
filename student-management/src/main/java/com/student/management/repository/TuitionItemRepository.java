package com.student.management.repository;

import com.student.management.entity.TuitionItem;
import com.student.management.enums.TuitionItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TuitionItemRepository extends JpaRepository<TuitionItem, Long> {
    Optional<TuitionItem> findByEnrollment_Id(Long enrollmentId);
    List<TuitionItem> findByInvoice_IdAndStatus(Long invoiceId, TuitionItemStatus status);
}
