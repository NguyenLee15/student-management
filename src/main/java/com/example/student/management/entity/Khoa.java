package com.example.student.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Khoa")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Khoa {
    @Id
    @Column (name = "MaKhoa", nullable= false, length=10)
    @NotBlank(message = "Mã khoa không được để trống")
    private String maKhoa;

    @Column (name = "TenKhoa", nullable= false, length=100)
    @NotBlank(message = "Tên khoa không được để trống")
    private String tenKhoa;
}
