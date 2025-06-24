package com.example.student.management.dto.resp;

import java.math.BigDecimal;

import com.example.student.management.enums.Dot;
import com.example.student.management.enums.HocKi;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DiemHocTap_DTO_Resp {
    private Integer  diemHocTapID;

    private String maSV;
    private String tenSV;        // join từ bảng SinhVien

    private String maHocPhan;
    private String tenHocPhan;   // join từ bảng HocPhan

    private HocKi hocKy;
    private String namHoc;
    private Dot dot;

    private BigDecimal diemThang10;
    private BigDecimal diemThang4;
    private String diemChu;
}
