package com.example.student.management.entity;

import com.example.student.management.enums.ToaNha;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name= "PhongHoc")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PhongHoc {
    @Id
    @Column(name= "MaPhong", nullable= false, length= 10)
    @NotBlank(message = "Mã phòng không được để trống")
    @Size(max = 10, message = "Mã phòng tối đa 10 ký tự")
    private String maPhong;

    @Column(name= "TenPhong", nullable= false, length= 100)
    @NotBlank(message = "Tên phòng không được để trống")
    @Size(max = 100, message = "Tên phòng tối đa 100 ký tự")
    private String tenPhong;

    @Column (name= "SucChua", nullable= false)
    @Min(value = 1, message = "Sức chứa phải lớn hơn 0")
    private int sucChua;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ToaNha", nullable = false)
    @NotNull(message = "Tòa nhà không được null")
    private ToaNha toaNha;

}
