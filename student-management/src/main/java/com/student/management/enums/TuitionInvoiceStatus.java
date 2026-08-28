// cSpell:disable
package com.student.management.enums;

public enum TuitionInvoiceStatus {
    UNPAID("Chưa thanh toán"),
    PARTIALLY_PAID("Đã thanh toán một phần"),
    PAID("Đã thanh toán đầy đủ");

    private final String displayName;

    TuitionInvoiceStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
