package com.student.management.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.student.management.dto.req.StudentRequestDto;
import com.student.management.entity.Faculty;
import com.student.management.entity.StudentClass;
import com.student.management.entity.User;
import com.student.management.enums.Gender;
import com.student.management.enums.Role;
import com.student.management.repository.FacultyRepository;
import com.student.management.repository.StudentClassRepository;
import com.student.management.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FacultyScopingSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private StudentClassRepository studentClassRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // Ensure test admin_cntt and admin_qtkd exist in DB with proper facultyId
        userRepository.findByUserName("admin_cntt").ifPresentOrElse(
                u -> {
                    u.setFacultyId("CNTT");
                    u.setRole(Role.FACULTY_ADMIN);
                    userRepository.save(u);
                },
                () -> userRepository.save(User.builder()
                        .userName("admin_cntt")
                        .password("pass")
                        .role(Role.FACULTY_ADMIN)
                        .facultyId("CNTT")
                        .build())
        );

        userRepository.findByUserName("admin_qtkd").ifPresentOrElse(
                u -> {
                    u.setFacultyId("QTKD");
                    u.setRole(Role.FACULTY_ADMIN);
                    userRepository.save(u);
                },
                () -> userRepository.save(User.builder()
                        .userName("admin_qtkd")
                        .password("pass")
                        .role(Role.FACULTY_ADMIN)
                        .facultyId("QTKD")
                        .build())
        );
    }

    @Test
    @DisplayName("admin_cntt should only query students belonging to faculty CNTT")
    @WithMockUser(username = "admin_cntt", roles = {"ADMIN", "FACULTY_ADMIN"})
    void getStudents_AsFacultyAdmin_ShouldOnlyReturnOwnFacultyStudents() throws Exception {
        mockMvc.perform(get("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content[*].facultyId", everyItem(is("CNTT"))));
    }

    @Test
    @DisplayName("admin_cntt should only query teachers belonging to faculty CNTT")
    @WithMockUser(username = "admin_cntt", roles = {"ADMIN", "FACULTY_ADMIN"})
    void getTeachers_AsFacultyAdmin_ShouldOnlyReturnOwnFacultyTeachers() throws Exception {
        mockMvc.perform(get("/api/v1/teachers")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content[*].facultyId", everyItem(is("CNTT"))));
    }

    @Test
    @DisplayName("admin_cntt attempting to create a student in another faculty class should receive 403 ACCESS_DENIED")
    @WithMockUser(username = "admin_cntt", roles = {"ADMIN", "FACULTY_ADMIN"})
    void createStudent_InAnotherFacultyClass_ShouldBeForbidden() throws Exception {
        // Find or ensure a class belonging to QTKD exists
        StudentClass qtkdClass = studentClassRepository.findAll().stream()
                .filter(sc -> sc.getFaculty() != null && "QTKD".equalsIgnoreCase(sc.getFaculty().getFacultyId()))
                .findFirst()
                .orElse(null);

        if (qtkdClass != null) {
            StudentRequestDto requestDto = StudentRequestDto.builder()
                    .studentId("SV999")
                    .fullName("Cross Faculty Infiltrator")
                    .email("cross_sv999@test.edu.vn")
                    .gender(Gender.MALE)
                    .dateOfBirth(LocalDate.of(2003, 1, 1))
                    .classId(qtkdClass.getClassId())
                    .academicYearId("2023-2024")
                    .build();

            mockMvc.perform(post("/api/v1/students")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(requestDto)))
                    .andExpect(status().isForbidden());
        }
    }

    @Test
    @DisplayName("admin (Super Admin) should be able to query students across all faculties")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getStudents_AsSuperAdmin_ShouldReturnAll() throws Exception {
        mockMvc.perform(get("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200));
    }
}
