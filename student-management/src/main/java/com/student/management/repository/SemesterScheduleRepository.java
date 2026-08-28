package com.student.management.repository;

import com.student.management.entity.SemesterSchedule;
import com.student.management.enums.ClassShift;
import com.student.management.enums.Semester;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;


public interface SemesterScheduleRepository extends JpaRepository<SemesterSchedule, Long> {

    @Query("SELECT ss FROM SemesterSchedule ss WHERE " +
           "(:creditClassId IS NULL OR ss.creditClass.creditClassId = :creditClassId) AND " +
           "(:subjectId IS NULL OR ss.subject.subjectId = :subjectId) AND " +
           "(:semester IS NULL OR ss.semester = :semester) AND " +
           "(:academicYear IS NULL OR ss.academicYear = :academicYear) AND " +
           "(:teacherId IS NULL OR ss.teacher.teacherId = :teacherId) AND " +
           "(:roomId IS NULL OR ss.classroom.roomId = :roomId) AND " +
           "(:classShift IS NULL OR ss.classShift = :classShift)")
    @EntityGraph(attributePaths = {"creditClass", "subject", "teacher", "classroom"})
    Page<SemesterSchedule> searchAndFilter(
            @Param("creditClassId") Long creditClassId,
            @Param("subjectId") String subjectId,
            @Param("semester") Semester semester,
            @Param("academicYear") String academicYear,
            @Param("teacherId") String teacherId,
            @Param("roomId") String roomId,
            @Param("classShift") ClassShift classShift,
            Pageable pageable
    );

    @Query("SELECT ss FROM SemesterSchedule ss WHERE ss.teacher.teacherId = :teacherId")
    @EntityGraph(attributePaths = {"creditClass", "subject", "teacher", "classroom"})
    List<SemesterSchedule> findByTeacherId(@Param("teacherId") String teacherId);

    @EntityGraph(attributePaths = {"creditClass", "subject", "teacher", "classroom"})
    List<SemesterSchedule> findByCreditClass_CreditClassIdIn(List<Long> creditClassIds);

    @EntityGraph(attributePaths = {"creditClass", "subject", "teacher", "classroom"})
    List<SemesterSchedule> findByCreditClass_CreditClassId(Long creditClassId);
}

