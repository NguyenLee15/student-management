package com.example.student.management.entity;

import java.time.LocalDate;

import com.example.student.management.enums.GioiTinh;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name= "SinhVien")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SinhVien {
    @Id
    @Column (name= "MaSV", nullable= false, length= 10)
    @NotBlank(message="Mã sinh viên không được để trống")
    private String maSinhVien;

    @Column(name= "HoVaTen", nullable= false, length= 100)
    @NotBlank(message= "Họ và tên không được để trống")
    private String hoVaTen;

    @Column (name= "NgaySinh")
    @Past (message= "Ngày sinh không hợp lệ")
    private LocalDate ngaySinh;

    @Enumerated(EnumType.STRING)
    @Column(name= "GioiTinh", nullable= false)
    @NotNull(message="Giới tính không được để null")
    private GioiTinh gioiTinh;

    @ManyToOne
    @JoinColumn(name= "MaLop", nullable= false)
    @NotNull(message= "Mã lớp không được null")
    private Lop lop;

    @ManyToOne
    @JoinColumn(name="MaKhoaHoc", nullable= false)
    @NotNull(message= "Mã khóa học không được null")
    private KhoaHoc khoaHoc;

    @Column(name= "Email", nullable= false, length= 100)
    @NotBlank(message= "Email không được để trống")
    @Email(message= "Email không hợp lệ")
    private String email;
}
