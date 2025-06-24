package com.example.student.management.entity;

import java.math.BigDecimal;

import com.example.student.management.enums.Dot;
import com.example.student.management.enums.HocKi;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name= "DiemHocTap", 
uniqueConstraints = @UniqueConstraint(columnNames = {"MaSV", "MaHocPhan", "HocKy", "NamHoc", "Dot"}))
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiemHocTap {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name= "DiemHocTapID")
    private Integer diemHocTapId;

    @ManyToOne
    @JoinColumn(name= "MaSV",nullable= false)
    @NotNull(message= "Mã sinh viên không được null")
    private SinhVien sinhVien;

    @ManyToOne
    @JoinColumn(name= "MaHocPhan",nullable= false)
    @NotNull(message= "Mã học phần không được null")
    private HocPhan hocPhan;

    @Enumerated(EnumType.STRING)
    @Column(name="HocKy", nullable= false)
    @NotNull(message= "Học kỳ không được null")
    private HocKi hocKy;

    @Column(name= "NamHoc", nullable= false, length= 9)
    @NotBlank(message= "Năm học không được để trống")
    private String namHoc;

    @Enumerated(EnumType.STRING)
    @Column(name= "Dot", nullable= false)
    @NotNull (message= "Đợt học không được null")
    private Dot dot;

    @DecimalMin(value = "0.0", inclusive = true, message = "Điểm thang 10 phải >= 0")
    @DecimalMax(value = "10.0", inclusive = true, message = "Điểm thang 10 phải <= 10")
    @Column(name = "DiemThang10", precision = 3, scale = 1)
    private BigDecimal diemThang10;

    @DecimalMin(value= "0.0", inclusive= true, message= "Điểm thang 4 phải >= 0")
    @DecimalMax(value = "4.0", inclusive = true, message = "Điểm thang 4 phải <= 4")
    @Column(name = "DiemThang4", precision = 3, scale = 1)
    private BigDecimal diemThang4;

    @Column(name = "diemChu", nullable= false)
    private String diemChu;
}
