package com.example.student.management.repository;

import com.example.student.management.entity.LopTinChi;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LopTinChi_Repository extends JpaRepository<LopTinChi, Integer> {
    boolean existsByLopTinChiId(Long id);

	Optional<LopTinChi> findByLopTinChiId(long l);
    
    
}