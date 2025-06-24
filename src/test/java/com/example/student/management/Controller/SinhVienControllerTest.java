package com.example.student.management.Controller;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import com.example.student.management.controller.SinhVienController;
import com.example.student.management.service.SinhVien_Service;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SinhVienController.class)
public class SinhVienControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SinhVien_Service sinhVienService;

    @Test
    public void testAddSinhVienSuccess() throws Exception {
        mockMvc.perform(post("/sinhvien/save")
                .param("maSinhVien", "SV001")
                .param("hoVaTen", "Nguyen A")
                .param("email", "a@gmail.com"))
                .andExpect(status().isOk());
    }

    @Test
    public void testAddSinhVienInvalidEmail() throws Exception {
        mockMvc.perform(post("/sinhvien/save")
                .param("maSinhVien", "SV002")
                .param("hoVaTen", "Tran B")
                .param("email", "invalid-email"))
                .andExpect(status().isBadRequest());
    }
}