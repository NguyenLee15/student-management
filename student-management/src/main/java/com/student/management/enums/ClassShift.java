// cSpell:disable
package com.student.management.enums;

public enum ClassShift {
    MORNING("Sáng"),
    AFTERNOON("Chiều"),
    EVENING("Tối");

    private final String displayName;

    ClassShift(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

