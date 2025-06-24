package com.example.student.management.entity;

import com.example.student.management.enums.CaHoc;
import com.example.student.management.enums.HocKi;
import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "lich_hoc_ky", 
       uniqueConstraints = @UniqueConstraint(
           columnNames = {"loptinchiid", "MaHocPhan", "HocKy", "NamHoc", "MaGiangVien", "MaPhong", "CaHoc"}))
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LichHocKy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lich_hoc_ky_id")
    private Long lichHocKyId;

    @ManyToOne
    @JoinColumn(name = "loptinchiid", nullable = false)
    @NotNull(message = "Lớp tín chỉ không được null")
    private LopTinChi lopTinChi;

    @ManyToOne
    @JoinColumn(name = "MaHocPhan", nullable = false)
    @NotNull(message = "Mã học phần không được null")
    private HocPhan hocPhan;

    @ManyToOne
    @JoinColumn(name = "MaGiangVien", nullable = false)
    @NotNull(message = "Mã giảng viên không được null")
    private GiangVien giangVien;

    @ManyToOne
    @JoinColumn(name = "MaPhong", nullable = false)
    @NotNull(message = "Phòng học không được null")
    private PhongHoc phongHoc;

    @Enumerated(EnumType.STRING)
    @Column(name = "HocKy", nullable = false)
    @NotNull(message = "Học kỳ không được null")
    private HocKi hocKy;

    @Column(name = "NamHoc", nullable = false, length = 9)
    @NotBlank(message = "Năm học không được để trống")
    private String namHoc;

    @Column(name = "ThoiGianHoc", nullable = false, length = 30)
    @NotBlank(message = "Thời gian học không được để trống")
    private String thoiGianHoc;

    @Enumerated(EnumType.STRING)
    @Column(name = "CaHoc", nullable = false)
    @NotNull(message = "Ca học không được null")
    private CaHoc caHoc;

    @NotNull(message = "Ngày bắt đầu học không được để null")
    @Column(name = "NgayBatDauHoc", nullable = false)
    private LocalDate ngayBatDauHoc;

    @NotNull(message = "Ngày kết thúc học không được để null")
    @Column(name = "NgayKetThucHoc", nullable = false)
    private LocalDate ngayKetThucHoc;

    @AssertTrue(message = "Ngày kết thúc học phải sau hoặc bằng ngày bắt đầu")
    public boolean isThoiGianHopLe() {
        if (ngayBatDauHoc == null || ngayKetThucHoc == null) return true;
        return !ngayKetThucHoc.isBefore(ngayBatDauHoc);
    }
}