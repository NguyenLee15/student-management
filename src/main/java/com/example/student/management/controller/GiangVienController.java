package com.example.student.management.controller;

import com.example.student.management.dto.req.GiangVien_DTO_Req;
import com.example.student.management.dto.resp.GiangVien_DTO_Resp;
import com.example.student.management.dto.resp.Khoa_DTO_Resp;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.service.GiangVien_Service;
import com.example.student.management.service.Khoa_Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/giangvien")
public class GiangVienController {

    @Autowired
    private GiangVien_Service giangVienService;

    @Autowired
    private Khoa_Service khoaService;

    @GetMapping
    public String listGiangVien(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String maKhoa,
            @RequestParam(required = false) String tenKhoa,
            Model model) {
        Page<GiangVien_DTO_Resp> giangVienPage;
        if (keyword != null && !keyword.isEmpty()) {
            giangVienPage = giangVienService.searchByTenGiangVien(keyword, page, size);
        } else if (maKhoa != null && !maKhoa.isEmpty()) {
            giangVienPage = giangVienService.searchByMaKhoa(maKhoa, page, size);
        } else if (tenKhoa != null && !tenKhoa.isEmpty()) {
            giangVienPage = giangVienService.searchByTenKhoa(tenKhoa, page, size);
        } else {
            giangVienPage = giangVienService.getAll(page, size);
        }

        List<Khoa_DTO_Resp> khoaList = khoaService.getAll();
        model.addAttribute("giangVienPage", giangVienPage);
        model.addAttribute("giangVien_DTO_", new GiangVien_DTO_Req());
        model.addAttribute("khoaList", khoaList);
        model.addAttribute("keyword", keyword);
        model.addAttribute("maKhoa", maKhoa);
        model.addAttribute("tenKhoa", tenKhoa);
        return "giangvien";
    }

    @PostMapping("/save")
    public String saveGiangVien(
            @Valid @ModelAttribute("giangVien_DTO_") GiangVien_DTO_Req giangVienReq,
            BindingResult result,
            @RequestParam(defaultValue = "0") int page,
            Model model,
            RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("giangVienPage", giangVienService.getAll(page, 5));
            model.addAttribute("khoaList", khoaService.getAll());
            model.addAttribute("error", "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
            return "giangvien";
        }
        try {
            // Kiểm tra tồn tại bằng repository để tránh gọi getById
            if (giangVienService.getById(giangVienReq.getMaGiangVien()).isPresent()) {
                giangVienService.update(giangVienReq.getMaGiangVien(), giangVienReq);
                redirectAttributes.addFlashAttribute("success", "Cập nhật giảng viên thành công!");
            } else {
                giangVienService.create(giangVienReq);
                redirectAttributes.addFlashAttribute("success", "Thêm giảng viên thành công!");
            }
        } catch (IllegalArgumentException | NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/giangvien?page=" + page;
    }

    @GetMapping("/edit/{maGiangVien}")
    public String editGiangVien(
            @PathVariable String maGiangVien,
            @RequestParam(defaultValue = "0") int page,
            Model model) {
        try {
            GiangVien_DTO_Resp giangVienResp = giangVienService.getById(maGiangVien)
                    .orElseThrow(() -> new NotFoundException("Giảng viên không tồn tại."));
            GiangVien_DTO_Req giangVienReq = new GiangVien_DTO_Req();
            giangVienReq.setMaGiangVien(giangVienResp.getMaGiangVien());
            giangVienReq.setTenGiangVien(giangVienResp.getTenGiangVien());
            giangVienReq.setEmail(giangVienResp.getEmail());
            giangVienReq.setMaKhoa(giangVienResp.getMaKhoa());
            model.addAttribute("giangVien_DTO_", giangVienReq);
            model.addAttribute("giangVienPage", giangVienService.getAll(page, 5));
            model.addAttribute("khoaList", khoaService.getAll());
            return "giangvien";
        } catch (NotFoundException ex) {
            model.addAttribute("error", "Giảng viên không tồn tại.");
            model.addAttribute("giangVienPage", giangVienService.getAll(page, 5));
            model.addAttribute("giangVien_DTO_", new GiangVien_DTO_Req());
            model.addAttribute("khoaList", khoaService.getAll());
            return "giangvien";
        }
    }

    @GetMapping("/delete/{maGiangVien}")
    public String deleteGiangVien(
            @PathVariable String maGiangVien,
            @RequestParam(defaultValue = "0") int page,
            RedirectAttributes redirectAttributes) {
        try {
            giangVienService.delete(maGiangVien);
            redirectAttributes.addFlashAttribute("success", "Xóa giảng viên thành công!");
        } catch (NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: Giảng viên không tồn tại.");
        }
        return "redirect:/giangvien?page=" + page;
    }
}