package com.example.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GiangVien_DTO_Resp {
    
    private String maGiangVien;
    private String tenGiangVien;
    private String email;
    private String maKhoa;
    private String tenKhoa;
}
