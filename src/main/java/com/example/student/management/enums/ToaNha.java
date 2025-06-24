package com.example.student.management.enums;

public enum ToaNha {
    PLC("PLC"),
    EAUT("EAUT"),
    DTD("DTD"),
    VN("VN"),
    TT("TT"),
    GR("GR");

    private final String ten;

    ToaNha(String ten) {
        this.ten = ten;
    }

    public String getTen() {
        return ten;
    }

    @Override
    public String toString() {
        return ten;
    }
}
