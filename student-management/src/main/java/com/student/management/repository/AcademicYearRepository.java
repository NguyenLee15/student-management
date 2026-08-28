package com.student.management.repository;

import com.student.management.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;



public interface AcademicYearRepository extends JpaRepository<AcademicYear, String> {
}

