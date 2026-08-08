package com.student.management.service;

import com.student.management.dto.req.ClassroomRequestDto;
import com.student.management.dto.resp.ClassroomResponseDto;
import com.student.management.enums.Building;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface ClassroomService {
    Page<ClassroomResponseDto> getAll(Pageable pageable);
    List<ClassroomResponseDto> getAll();
    List<ClassroomResponseDto> getByBuilding(Building building);
    Page<ClassroomResponseDto> searchAndFilter(String keyword, Building building, Pageable pageable);
    ClassroomResponseDto getById(String roomId);
    ClassroomResponseDto create(ClassroomRequestDto dto);
    ClassroomResponseDto update(String roomId, ClassroomRequestDto dto);
    void delete(String roomId);
    ByteArrayInputStream exportToExcel(List<ClassroomResponseDto> classrooms);
}

