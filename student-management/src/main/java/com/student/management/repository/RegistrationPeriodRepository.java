package com.student.management.repository;

import com.student.management.entity.RegistrationPeriod;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface RegistrationPeriodRepository extends JpaRepository<RegistrationPeriod, Long> {

    @EntityGraph(attributePaths = {"semester", "semester.academicYear"})
    List<RegistrationPeriod> findBySemester_Id(Long semesterId);

    @EntityGraph(attributePaths = {"semester", "semester.academicYear"})
    @Query("SELECT r FROM RegistrationPeriod r WHERE r.active = true AND :now BETWEEN r.startTime AND r.endTime ORDER BY r.startTime DESC")
    List<RegistrationPeriod> findActivePeriodsAt(@Param("now") LocalDateTime now);

    @EntityGraph(attributePaths = {"semester", "semester.academicYear"})
    @Query("SELECT r FROM RegistrationPeriod r WHERE r.active = true AND r.semester.id = :semesterId AND :now BETWEEN r.startTime AND r.endTime")
    Optional<RegistrationPeriod> findActivePeriodForSemester(@Param("semesterId") Long semesterId, @Param("now") LocalDateTime now);
}
