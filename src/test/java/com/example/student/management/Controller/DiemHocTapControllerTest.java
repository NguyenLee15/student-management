package com.example.student.management.Controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import com.example.student.management.controller.DiemHocTapController;
import com.example.student.management.service.DiemHocTap_Service;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DiemHocTapController.class)
public class DiemHocTapControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DiemHocTap_Service diemHocTapService;

    @Test
    public void testSaveDiemHocTapSuccess() throws Exception {
        mockMvc.perform(post("/diemhoctap/save")
                .param("MaSV", "SV001")
                .param("MaHocPhan", "HP001")
                .param("HocKy", "HK1")
                .param("NamHoc", "2024-2025")
                .param("DiemThang10", "8.5"))
                .andExpect(status().isOk());
    }

    @Test
    public void testListDiemHocTap() throws Exception {
        mockMvc.perform(get("/diemhoctap/list"))
                .andExpect(status().isOk());
    }
}