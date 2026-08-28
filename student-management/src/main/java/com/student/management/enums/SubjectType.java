// cSpell:disable
package com.student.management.enums;

public enum SubjectType {
    GENERAL_EDUCATION("Giáo dục đại cương"),
    BASIC("Cơ sở ngành"),
    MAJOR("Chuyên ngành"),
    SPECIALIZED("Chuyên sâu"),
    ELECTIVE("Tự chọn");

    private final String displayName;

    SubjectType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
