package com.example.student.management.service.impl;

import com.example.student.management.dto.req.StudentRequestDto;
import com.example.student.management.dto.resp.StudentResponseDto;
import com.example.student.management.entity.AcademicYear;
import com.example.student.management.entity.Student;
import com.example.student.management.entity.StudentClass;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.repository.AcademicYearRepository;
import com.example.student.management.repository.StudentClassRepository;
import com.example.student.management.repository.StudentRepository;
import com.example.student.management.service.StudentService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentClassRepository studentClassRepository;

    @Autowired
    private AcademicYearRepository academicYearRepository;

    @Override
    public Page<StudentResponseDto> getAll(Pageable pageable) {
        return studentRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public Page<StudentResponseDto> searchAndFilter(String keyword, String classId, String facultyId, String academicYearId, Pageable pageable) {
        return studentRepository.searchAndFilter(keyword, classId, facultyId, academicYearId, pageable).map(this::mapToDto);
    }

    @Override
    public StudentResponseDto create(StudentRequestDto dto) {
        StudentClass studentClass = studentClassRepository.findById(dto.getClassId())
                .orElseThrow(() -> new NotFoundException("Student Class not found: " + dto.getClassId()));

        AcademicYear academicYear = academicYearRepository.findById(dto.getAcademicYearId())
                .orElseThrow(() -> new NotFoundException("Academic Year not found: " + dto.getAcademicYearId()));

        Student student = Student.builder()
                .studentId(dto.getStudentId())
                .fullName(dto.getFullName())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .studentClass(studentClass)
                .academicYear(academicYear)
                .email(dto.getEmail())
                .build();

        return mapToDto(studentRepository.save(student));
    }

    @Override
    public StudentResponseDto update(String studentId, StudentRequestDto dto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found: " + studentId));

        StudentClass studentClass = studentClassRepository.findById(dto.getClassId())
                .orElseThrow(() -> new NotFoundException("Student Class not found: " + dto.getClassId()));

        AcademicYear academicYear = academicYearRepository.findById(dto.getAcademicYearId())
                .orElseThrow(() -> new NotFoundException("Academic Year not found: " + dto.getAcademicYearId()));

        student.setFullName(dto.getFullName());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setGender(dto.getGender());
        student.setStudentClass(studentClass);
        student.setAcademicYear(academicYear);
        student.setEmail(dto.getEmail());

        return mapToDto(studentRepository.save(student));
    }

    @Override
    public void delete(String studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new NotFoundException("Student not found: " + studentId);
        }
        studentRepository.deleteById(studentId);
    }

    @Override
    public StudentResponseDto getById(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found: " + studentId));
        return mapToDto(student);
    }

    @Override
    public List<StudentResponseDto> importFromExcel(MultipartFile file) {
        List<StudentResponseDto> imported = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header
                String id = getCellValueAsString(row.getCell(0));
                String name = getCellValueAsString(row.getCell(1));
                String email = row.getCell(5) != null ? getCellValueAsString(row.getCell(5)) : (row.getCell(2) != null ? getCellValueAsString(row.getCell(2)) : "");

                if (id.isEmpty() || name.isEmpty()) continue;

                Student s = studentRepository.findById(id).orElseGet(() -> Student.builder().studentId(id).build());
                s.setFullName(name);
                s.setEmail(email.isEmpty() ? id.toLowerCase() + "@edu.vn" : email);

                Student saved = studentRepository.save(s);
                imported.add(mapToDto(saved));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }
        return imported;
    }

    private String getCellValueAsString(org.apache.poi.ss.usermodel.Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

    @Override
    public ByteArrayInputStream exportToExcel(List<StudentResponseDto> students) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Students");

            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Student ID");
            headerRow.createCell(1).setCellValue("Full Name");
            headerRow.createCell(2).setCellValue("Class");
            headerRow.createCell(3).setCellValue("Faculty");
            headerRow.createCell(4).setCellValue("Email");

            int rowIdx = 1;
            for (StudentResponseDto s : students) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(s.getStudentId());
                row.createCell(1).setCellValue(s.getFullName());
                row.createCell(2).setCellValue(s.getClassName());
                row.createCell(3).setCellValue(s.getFacultyName());
                row.createCell(4).setCellValue(s.getEmail());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to export Excel file: " + e.getMessage());
        }
    }

    @Override
    public List<StudentResponseDto> getAllForExport() {
        return studentRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<StudentResponseDto> getStudentsByClassId(String classId) {
        return studentRepository.findByStudentClass_ClassId(classId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private StudentResponseDto mapToDto(Student s) {
        return StudentResponseDto.builder()
                .studentId(s.getStudentId())
                .fullName(s.getFullName())
                .dateOfBirth(s.getDateOfBirth())
                .gender(s.getGender())
                .classId(s.getStudentClass() != null ? s.getStudentClass().getClassId() : null)
                .className(s.getStudentClass() != null ? s.getStudentClass().getClassName() : null)
                .facultyId(s.getStudentClass() != null && s.getStudentClass().getFaculty() != null ? s.getStudentClass().getFaculty().getFacultyId() : null)
                .facultyName(s.getStudentClass() != null && s.getStudentClass().getFaculty() != null ? s.getStudentClass().getFaculty().getFacultyName() : null)
                .academicYearId(s.getAcademicYear() != null ? s.getAcademicYear().getAcademicYearId() : null)
                .email(s.getEmail())
                .build();
    }
}
