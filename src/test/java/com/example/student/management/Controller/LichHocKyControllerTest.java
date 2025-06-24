package com.example.student.management.Controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import com.example.student.management.controller.LichHocKyController;
import com.example.student.management.service.LichHocKy_Service;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LichHocKyController.class)
public class LichHocKyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LichHocKy_Service lichHocKyService;

    @Test
    public void testSaveLichHocKySuccess() throws Exception {
        mockMvc.perform(post("/lichhocky/save")
                .param("loptinchiid", "1")
                .param("MaHocPhan", "HP001")
                .param("HocKy", "HK1")
                .param("NamHoc", "2024-2025")
                .param("CaHoc", "SAO"))
                .andExpect(status().isOk());
    }

    @Test
    public void testListLichHocKy() throws Exception {
        mockMvc.perform(get("/lichhocky/list"))
                .andExpect(status().isOk());
    }
}
