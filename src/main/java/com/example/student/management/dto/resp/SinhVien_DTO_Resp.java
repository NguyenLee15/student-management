package com.example.student.management.dto.resp;

import java.time.LocalDate;
import com.example.student.management.enums.GioiTinh;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SinhVien_DTO_Resp {
    private String maSV;
    private String hoVaTen;
    private LocalDate ngaySinh;
    private GioiTinh gioiTinh;
    private String email;
    private String maLop;
    private String maKhoaHoc;
}