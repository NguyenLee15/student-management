package com.example.student.management.enums;

public enum CaHoc {
    SANG("Sáng"),
    CHIEU("Chiều"),
    TOI("Tối");

	private final String value;

    CaHoc(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
    
}
