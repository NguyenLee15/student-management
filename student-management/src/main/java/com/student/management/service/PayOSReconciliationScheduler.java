// cSpell:disable
package com.student.management.service;

import com.student.management.entity.PaymentTransaction;
import com.student.management.enums.PaymentTransactionStatus;
import com.student.management.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayOSReconciliationScheduler {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PayOSService payOSService;

    /**
     * Tác vụ định kỳ (mỗi 10 phút) quét các đơn hàng PENDING để đồng bộ trạng thái từ PayOS
     */
    @Scheduled(fixedDelay = 600000, initialDelay = 60000)
    public void reconcilePendingTransactions() {
        log.info("⏰ Starting PayOS pending transactions reconciliation...");
        try {
            LocalDateTime fifteenMinutesAgo = LocalDateTime.now().minusMinutes(15);
            List<PaymentTransaction> pendingTxns = paymentTransactionRepository.findByStatusAndCreatedAtBefore(
                    PaymentTransactionStatus.PENDING, fifteenMinutesAgo);

            if (pendingTxns.isEmpty()) {
                log.info("ℹ️ No pending PayOS transactions require reconciliation.");
                return;
            }

            log.info("🔄 Found {} pending PayOS transactions to reconcile.", pendingTxns.size());

            for (PaymentTransaction txn : pendingTxns) {
                try {
                    // Nếu quá 24h mà vẫn pending thì đánh dấu expired
                    if (txn.getCreatedAt().isBefore(LocalDateTime.now().minusHours(24))) {
                        txn.setStatus(PaymentTransactionStatus.EXPIRED);
                        paymentTransactionRepository.save(txn);
                        log.info("⌛ Marked transaction #{} as EXPIRED (older than 24h)", txn.getOrderCode());
                    } else {
                        payOSService.syncTransactionStatus(txn.getOrderCode());
                    }
                } catch (Exception e) {
                    log.warn("⚠️ Failed to reconcile orderCode #{}: {}", txn.getOrderCode(), e.getMessage());
                }
            }
            log.info("✅ PayOS reconciliation completed.");
        } catch (Exception e) {
            log.error("❌ Error during PayOS reconciliation run: {}", e.getMessage(), e);
        }
    }
}

