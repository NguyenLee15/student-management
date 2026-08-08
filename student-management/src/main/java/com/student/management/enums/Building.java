package com.student.management.enums;

public enum Building {
    PLC("PLC"),
    EAUT("EAUT"),
    DTD("DTD"),
    VN("VN"),
    TT("TT"),
    GR("GR");

    private final String name;

    Building(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return name;
    }
}

