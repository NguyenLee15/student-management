package com.student.management.enums;

public enum PaymentTransactionStatus {
    PENDING("Đang chờ thanh toán"),
    PAID("Đã thanh toán thành công"),
    CANCELLED("Đã hủy giao dịch"),
    EXPIRED("Hết hạn thanh toán"),
    FAILED("Giao dịch thất bại");

    private final String displayName;

    PaymentTransactionStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

