package com.student.management.service.impl;

import com.student.management.dto.req.SemesterScheduleRequestDto;
import com.student.management.dto.req.SemesterScheduleUpdateDto;
import com.student.management.dto.resp.SemesterScheduleResponseDto;
import com.student.management.entity.*;
import com.student.management.enums.ClassShift;
import com.student.management.enums.Semester;
import com.student.management.exception.NotFoundException;
import com.student.management.mapping.SemesterScheduleMapper;
import com.student.management.repository.*;
import com.student.management.service.SemesterScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SemesterScheduleServiceImpl implements SemesterScheduleService {

    private final SemesterScheduleRepository semesterScheduleRepository;
    private final CreditClassRepository creditClassRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final ClassroomRepository classroomRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<SemesterScheduleResponseDto> getAll(Pageable pageable) {
        return semesterScheduleRepository.findAll(pageable).map(SemesterScheduleMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public SemesterScheduleResponseDto getById(Long scheduleId) {
        SemesterSchedule ss = semesterScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new NotFoundException("Schedule not found: " + scheduleId));
        return SemesterScheduleMapper.toDto(ss);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SemesterScheduleResponseDto> searchAndFilter(
            Long creditClassId, String subjectId, Semester semester, String academicYear,
            String teacherId, String roomId, ClassShift classShift, Pageable pageable) {
        return semesterScheduleRepository.searchAndFilter(creditClassId, subjectId, semester, academicYear, teacherId, roomId, classShift, pageable)
                .map(SemesterScheduleMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SemesterScheduleResponseDto> getByTeacherId(String teacherId) {
        return SemesterScheduleMapper.toDtoList(semesterScheduleRepository.findByTeacherId(teacherId));
    }

    @Override
    @Transactional
    public SemesterScheduleResponseDto create(SemesterScheduleRequestDto dto) {
        CreditClass creditClass = creditClassRepository.findById(dto.getCreditClassId())
                .orElseThrow(() -> new NotFoundException("Credit class not found: " + dto.getCreditClassId()));
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new NotFoundException("Subject not found: " + dto.getSubjectId()));
        Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new NotFoundException("Teacher not found: " + dto.getTeacherId()));
        Classroom classroom = classroomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new NotFoundException("Classroom not found: " + dto.getRoomId()));

        SemesterSchedule schedule = SemesterScheduleMapper.toEntity(dto, creditClass, subject, teacher, classroom);
        return SemesterScheduleMapper.toDto(semesterScheduleRepository.save(schedule));
    }

    @Override
    @Transactional
    public SemesterScheduleResponseDto update(Long scheduleId, SemesterScheduleUpdateDto dto) {
        SemesterSchedule schedule = semesterScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new NotFoundException("Schedule not found: " + scheduleId));
        CreditClass creditClass = creditClassRepository.findById(dto.getCreditClassId())
                .orElseThrow(() -> new NotFoundException("Credit class not found: " + dto.getCreditClassId()));
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new NotFoundException("Subject not found: " + dto.getSubjectId()));
        Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new NotFoundException("Teacher not found: " + dto.getTeacherId()));
        Classroom classroom = classroomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new NotFoundException("Classroom not found: " + dto.getRoomId()));

        schedule.setCreditClass(creditClass);
        schedule.setSubject(subject);
        schedule.setTeacher(teacher);
        schedule.setClassroom(classroom);
        schedule.setSemester(dto.getSemester());
        schedule.setAcademicYear(dto.getAcademicYear());
        schedule.setStudyTime(dto.getStudyTime());
        schedule.setClassShift(dto.getClassShift());
        schedule.setStartDate(dto.getStartDate());
        schedule.setEndDate(dto.getEndDate());

        return SemesterScheduleMapper.toDto(semesterScheduleRepository.save(schedule));
    }

    @Override
    @Transactional
    public void delete(Long scheduleId) {
        if (!semesterScheduleRepository.existsById(scheduleId)) {
            throw new NotFoundException("Schedule not found: " + scheduleId);
        }
        semesterScheduleRepository.deleteById(scheduleId);
    }
}

