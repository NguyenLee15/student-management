package com.student.management.enums;

public enum SubjectType {
    MAJOR("Chuyên Ngành"),
    GENERAL_EDUCATION("Giáo dục đại cương");

    private final String displayName;

    SubjectType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

