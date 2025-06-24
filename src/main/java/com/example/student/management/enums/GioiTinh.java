package com.example.student.management.enums;

public enum  GioiTinh {
    NAM("nam"),
    Nu("nữ");

    private final String gioitinh;

    GioiTinh(String gioitinh) {
        this.gioitinh = gioitinh;
    }

    public String getGioiTinh() {
        return gioitinh;
    }
}
