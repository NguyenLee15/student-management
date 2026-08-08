package com.student.management.controller.api;

import com.student.management.dto.resp.StudentResponseDto;
import com.student.management.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class StudentRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getAllStudents_ShouldReturnPageOfStudents() throws Exception {
        StudentResponseDto dto = StudentResponseDto.builder()
                .studentId("SV001")
                .fullName("Nguyen Van A")
                .email("a@gmail.com")
                .build();

        Page<StudentResponseDto> page = new PageImpl<>(List.of(dto), PageRequest.of(0, 10), 1);
        when(studentService.searchAndFilter(any(), any(), any(), any(), any())).thenReturn(page);

        mockMvc.perform(get("/api/v1/students")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content[0].studentId").value("SV001"))
                .andExpect(jsonPath("$.data.content[0].fullName").value("Nguyen Van A"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getStudentById_ShouldReturnStudent() throws Exception {
        StudentResponseDto dto = StudentResponseDto.builder()
                .studentId("SV001")
                .fullName("Nguyen Van A")
                .email("a@gmail.com")
                .build();

        when(studentService.getById("SV001")).thenReturn(dto);

        mockMvc.perform(get("/api/v1/students/SV001")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.studentId").value("SV001"))
                .andExpect(jsonPath("$.data.fullName").value("Nguyen Van A"));
    }
}
