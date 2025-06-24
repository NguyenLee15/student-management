package com.example.student.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name= "Lop")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Lop {
    @Id
    @Column(name= "MaLop", nullable= false, length=10)
    @NotBlank(message = "Mã lớp không được để trống")
    @Size(max = 10, message = "Mã lớp tối đa 10 ký tự")
    private String maLop;

    @Column(name="TenLop", nullable= false, length= 100)
    @NotBlank(message= "Tên lớp không được để trống")
    @Size(max = 100, message = "Tên lớp tối đa 100 ký tự")
    private String tenLop;

    @ManyToOne
    @JoinColumn(name = "MaKhoa", nullable = false)
    @NotNull(message = "Mã khoa không được null")
    private Khoa khoa;
}
