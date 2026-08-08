package com.student.management.service;

import com.student.management.dto.req.AcademicGradeRequestDto;
import com.student.management.dto.req.AcademicGradeUpdateDto;
import com.student.management.dto.resp.AcademicGradeResponseDto;
import com.student.management.enums.Semester;
import com.student.management.enums.StudyPhase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface AcademicGradeService {
    Page<AcademicGradeResponseDto> getAll(Pageable pageable);
    AcademicGradeResponseDto getById(Integer gradeId);
    Page<AcademicGradeResponseDto> searchAndFilter(
            String studentId, String subjectId, Semester semester, String academicYear, StudyPhase studyPhase, Pageable pageable
    );
    List<AcademicGradeResponseDto> getByStudentId(String studentId);
    AcademicGradeResponseDto create(AcademicGradeRequestDto dto);
    AcademicGradeResponseDto update(Integer gradeId, AcademicGradeUpdateDto dto);
    void delete(Integer gradeId);
    List<AcademicGradeResponseDto> importFromExcel(MultipartFile file);
    ByteArrayInputStream exportToExcel(List<AcademicGradeResponseDto> grades);
}

