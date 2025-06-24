package com.example.student.management.enums;

public enum HocKi {
    MOT("MOT"),
    HAI("HAI"),
    BA("BA"),;

    private final String value;

    HocKi(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

}
