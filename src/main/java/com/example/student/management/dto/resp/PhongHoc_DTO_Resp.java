package com.example.student.management.dto.resp;

import com.example.student.management.enums.ToaNha;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class PhongHoc_DTO_Resp {
    private String maPhong;
    private String tenPhong;
    private Integer sucChua;
    private ToaNha toaNha;
}
