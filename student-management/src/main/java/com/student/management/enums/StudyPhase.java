// cSpell:disable
package com.student.management.enums;

public enum StudyPhase {
    PHASE_1("Đợt 1"),
    PHASE_2("Đợt 2"),
    PHASE_3("Đợt 3");

    private final String displayName;

    StudyPhase(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

