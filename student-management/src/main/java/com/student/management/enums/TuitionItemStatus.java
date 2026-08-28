// cSpell:disable
package com.student.management.enums;

public enum TuitionItemStatus {
    ACTIVE("Đang áp dụng"),
    CANCELLED("Đã hủy");

    private final String displayName;

    TuitionItemStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
