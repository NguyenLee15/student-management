// cSpell:disable
package com.student.management.enums;

public enum Semester {
    SEMESTER_1("Học kỳ 1"),
    SEMESTER_2("Học kỳ 2"),
    SUMMER_SEMESTER("Học kỳ hè");

    private final String displayName;

    Semester(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

