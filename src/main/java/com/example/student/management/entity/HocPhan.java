package com.example.student.management.entity;

import com.example.student.management.enums.LoaiHocPhan;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "HocPhan")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HocPhan {
    @Id
    @Column(name = "MaHocPhan", nullable = false, length = 10)
    @NotBlank(message = "Mã học phần không được để trống")
    private String maHocPhan;

    @Column(name = "TenHocPhan", nullable = false, length = 100)
    @NotBlank(message = "Tên học phần không được để trống")
    private String tenHocPhan;

    @Enumerated(EnumType.STRING)
    @Column(name = "LoaiHocPhan", nullable = false)
    @NotNull(message = "Loại học phần không được null")
    private LoaiHocPhan loaiHocPhan;

    @Min(value = 1, message = "Số tiền tín chỉ phải lớn hơn 0")
    @Column(name = "SoTienTinChi", nullable = false)
    private Integer soTienTinChi;

    @Min(value = 1, message = "Số tín chỉ phải lớn hơn 0")
    @Column(name = "SoTinChi", nullable = false)
    private Integer soTinChi;

    @ManyToOne
    @JoinColumn(name = "MaKhoa", nullable = false)
    @NotNull(message = "Mã khoa không được để trống")
    private Khoa khoa;
}