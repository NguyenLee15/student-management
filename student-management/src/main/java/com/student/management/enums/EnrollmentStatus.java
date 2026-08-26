package com.student.management.enums;

public enum EnrollmentStatus {
    ENROLLED("Đang theo học"),
    DROPPED("Đã rút (Trong đợt - Hoàn phí 100%)"),
    WITHDRAWN("Rút học phần (Sau đợt - Không hoàn phí)");

    private final String displayName;

    EnrollmentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
