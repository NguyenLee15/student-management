// cSpell:disable
package com.student.management.repository;

import com.student.management.entity.Classroom;
import com.student.management.enums.Building;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;


public interface ClassroomRepository extends JpaRepository<Classroom, String> {

    @Query("SELECT c FROM Classroom c WHERE c.building = :building")
    List<Classroom> findByBuilding(@Param("building") Building building);

    @Query("SELECT c FROM Classroom c WHERE " +
           "(:keyword IS NULL OR LOWER(c.roomId) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.roomName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:building IS NULL OR c.building = :building)")
    Page<Classroom> searchAndFilter(
            @Param("keyword") String keyword,
            @Param("building") Building building,
            Pageable pageable
    );
}

