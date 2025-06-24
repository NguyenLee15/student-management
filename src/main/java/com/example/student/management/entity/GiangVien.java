package com.example.student.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name= "GiangVien")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GiangVien {
    @Id
    @Column(name= "MaGiangVien", nullable= false, length= 10)
    @NotBlank(message= "Mã giảng viên không được để trống ")
    private String maGiangVien;

    @Column(name= "TenGiangVien", nullable= false, length= 100)
    @NotBlank(message= "Tên giảng viên không được để trống ")
    private String tenGiangVien;

    @Column(name= "Email", nullable= false, length= 100)
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @ManyToOne
    @JoinColumn(name="MaKhoa", nullable= false)
    @NotNull(message = "Khoa không được để trống")
    private Khoa khoa;
    
}
