package com.example.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class KhoaHoc_DTO_Resp {
    private String maKhoaHoc;
    private Integer namBatDau;
    private Integer namKetThuc;
}
