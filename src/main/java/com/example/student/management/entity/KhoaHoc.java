package com.example.student.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table (name = "KhoaHoc")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class KhoaHoc {
    @Id
    @Column (name = "MaKhoaHoc", nullable= false, length=9)
    @NotBlank(message = "Mã khóa học không được để trống")
    private String maKhoaHoc;

    @Column (name = "NamBatDau", nullable= false)
    @Min(value = 1900, message = "Năm bắt đầu phải lớn hơn 1900")
    private Integer namBatDau;
    
    @Column (name = "NamKetThuc", nullable= false)
    @Min(value = 1900, message = "Năm kết thúc phải lớn hơn 1900")
    private Integer namKetThuc;
}
