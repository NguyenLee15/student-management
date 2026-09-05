package com.student.management.controller.api;

import com.student.management.entity.User;
import com.student.management.enums.Role;
import com.student.management.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TeacherPortalSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("GET /api/v1/teachers/me should return GV001 for demo teacher")
    @WithMockUser(username = "teacher", roles = {"TEACHER"})
    void getCurrentTeacher_ShouldReturnSuccess() throws Exception {
        mockMvc.perform(get("/api/v1/teachers/me")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.teacherId").value("GV001"));
    }

    @Test
    @DisplayName("GET /api/v1/credit-classes/my-classes should return 200 for demo teacher")
    @WithMockUser(username = "teacher", roles = {"TEACHER"})
    void getMyClasses_ShouldReturnSuccess() throws Exception {
        mockMvc.perform(get("/api/v1/credit-classes/my-classes")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200));
    }

    @Test
    @DisplayName("GET /api/v1/semester-schedules/my-schedules should return 200 for demo teacher")
    @WithMockUser(username = "teacher", roles = {"TEACHER"})
    void getMySchedules_ShouldReturnSuccess() throws Exception {
        mockMvc.perform(get("/api/v1/semester-schedules/my-schedules")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200));
    }

    @Test
    @DisplayName("Auto-healing: Demo teacher with NULL teacherId in DB should automatically heal to GV002 and succeed")
    @WithMockUser(username = "teacher2", roles = {"TEACHER"})
    void getMe_WithNullTeacherId_ShouldAutoHealAndSucceed() throws Exception {
        // Explicitly simulate legacy/broken state where teacher2 has null teacherId
        User teacher2 = userRepository.findByUserName("teacher2").orElseGet(() ->
                User.builder()
                        .userName("teacher2")
                        .password("dummy")
                        .role(Role.TEACHER)
                        .build()
        );
        teacher2.setTeacherId(null);
        userRepository.save(teacher2);

        // Calling /api/v1/teachers/me should trigger auto-healing and succeed with GV002
        mockMvc.perform(get("/api/v1/teachers/me")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.teacherId").value("GV002"));

        // Verify DB record is now healed
        User healedUser = userRepository.findByUserName("teacher2").orElseThrow();
        assertEquals("GV002", healedUser.getTeacherId());
    }
}
