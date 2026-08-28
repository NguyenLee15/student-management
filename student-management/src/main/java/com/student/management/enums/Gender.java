// cSpell:disable
package com.student.management.enums;

public enum Gender {
    MALE("nam"),
    FEMALE("nữ"),
    OTHER("khác");

    private final String displayName;

    Gender(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

