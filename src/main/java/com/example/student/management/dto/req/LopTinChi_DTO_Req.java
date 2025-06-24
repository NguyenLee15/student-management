package com.example.student.management.dto.req;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LopTinChi_DTO_Req {
	
    private Long lopTinChiId;

    @NotBlank(message = "Tên lớp tín chỉ không được để trống")
    private String tenLopTinChi;

    @NotBlank(message = "Mã học phần không được để trống")
    private String maHocPhan;

}