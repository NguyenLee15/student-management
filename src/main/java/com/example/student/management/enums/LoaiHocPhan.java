package com.example.student.management.enums;

public enum LoaiHocPhan {
    Chuyen_Nganh("Chuyên Ngành"),
    Giao_Duc_Dai_Cuong("Giáo dục đại cương");

     private final String displayName;

     // Constructor
    LoaiHocPhan(String displayName) {
        this.displayName = displayName;
    }

    // Getter để lấy tên hiển thị
    public String getDisplayName() {
        return displayName;
    }

}
