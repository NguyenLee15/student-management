// cSpell:disable
package com.student.management.service;

import com.student.management.dto.req.SemesterScheduleRequestDto;
import com.student.management.dto.req.SemesterScheduleUpdateDto;
import com.student.management.dto.resp.SemesterScheduleResponseDto;
import com.student.management.enums.ClassShift;
import com.student.management.enums.Semester;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SemesterScheduleService {
    Page<SemesterScheduleResponseDto> getAll(Pageable pageable);
    SemesterScheduleResponseDto getById(Long scheduleId);
    Page<SemesterScheduleResponseDto> searchAndFilter(
            Long creditClassId, String subjectId, Semester semester, String academicYear,
            String teacherId, String roomId, ClassShift classShift, Pageable pageable
    );
    List<SemesterScheduleResponseDto> getByTeacherId(String teacherId);
    SemesterScheduleResponseDto create(SemesterScheduleRequestDto dto);
    SemesterScheduleResponseDto update(Long scheduleId, SemesterScheduleUpdateDto dto);
    void delete(Long scheduleId);
}

