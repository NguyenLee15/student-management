package com.example.student.management.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lop_tin_chi")
@Getter
@Setter
public class LopTinChi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lop_tin_chi_id")
    private Long lopTinChiId;

    @Column(name = "ten_lop_tin_chi", nullable = false)
    private String tenLopTinChi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_hoc_phan", nullable = false)
    private HocPhan hocPhan;

    @OneToMany(mappedBy = "lopTinChi", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LopTinChiSinhVien> lopTinChiSinhViens = new ArrayList<>();
}