package com.example.student.management.dto.req;

import com.example.student.management.enums.ToaNha;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class PhongHoc_DTO_Req {
    @NotBlank(message= "Mã phòng không được để trống")
    @Size(max = 10)
    private String maPhong;

    @NotBlank(message= "Tên phòng không được ở trống")
    @Size(max = 100)
    private String tenPhong;

    @Min(value = 1, message = "Sức chứa phải > 0")
    private Integer sucChua;

    @NotNull(message= "Toàn nhà không được null")
    private ToaNha toaNha;
}
