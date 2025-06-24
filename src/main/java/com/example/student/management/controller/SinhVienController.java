package com.example.student.management.controller;

import jakarta.validation.Valid;
import java.io.ByteArrayInputStream;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.example.student.management.dto.req.SinhVien_DTO_Req;
import com.example.student.management.dto.resp.KhoaHoc_DTO_Resp;
import com.example.student.management.dto.resp.Khoa_DTO_Resp;
import com.example.student.management.dto.resp.Lop_DTO_Resp;
import com.example.student.management.dto.resp.SinhVien_DTO_Resp;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.repository.SinhVien_Repository;
import com.example.student.management.service.KhoaHoc_Service;
import com.example.student.management.service.Khoa_Service;
import com.example.student.management.service.Lop_Service;
import com.example.student.management.service.SinhVien_Service;

@Controller
@RequestMapping("/sinhvien")
public class SinhVienController {

    @Autowired
    private SinhVien_Service sinhVienService;
    
    @Autowired
    private SinhVien_Repository sinhVienRepository;

    @Autowired
    private Lop_Service lopService;

    @Autowired
    private KhoaHoc_Service khoaHocService;

    @Autowired
    private Khoa_Service khoaService;

    @GetMapping
    public String listSinhVien(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String maLop,
            @RequestParam(required = false) String maKhoa,
            @RequestParam(required = false) String maKhoaHoc,
            Model model) {
        Page<SinhVien_DTO_Resp> sinhVienPage;

        // Tìm kiếm theo mã SV hoặc tên, kết hợp lọc
        sinhVienPage = sinhVienService.searchAndFilter(keyword, maLop, maKhoa, maKhoaHoc, PageRequest.of(page, size));

        // Lấy danh sách lớp, khóa, khoa cho dropdown
        List<Lop_DTO_Resp> lopList = lopService.getAll();
        List<KhoaHoc_DTO_Resp> khoaHocList = khoaHocService.getAll();
        List<Khoa_DTO_Resp> khoaList = khoaService.getAll();

        model.addAttribute("sinhVienPage", sinhVienPage);
        model.addAttribute("sinhVien_DTO_", new SinhVien_DTO_Req());
        model.addAttribute("lopList", lopList);
        model.addAttribute("khoaHocList", khoaHocList);
        model.addAttribute("khoaList", khoaList);
        model.addAttribute("keyword", keyword);
        model.addAttribute("maLop", maLop);
        model.addAttribute("maKhoa", maKhoa);
        model.addAttribute("maKhoaHoc", maKhoaHoc);
        return "sinhvien";
    }

    @PostMapping("/save")
    public String saveSinhVien(
            @Valid @ModelAttribute("sinhVien_DTO_") SinhVien_DTO_Req sinhVienReq,
            BindingResult result,
            @RequestParam(defaultValue = "0") int page,
            Model model,
            RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("sinhVienPage", sinhVienService.getAll(PageRequest.of(page, 5)));
            model.addAttribute("lopList", lopService.getAll());
            model.addAttribute("khoaHocList", khoaHocService.getAll());
            model.addAttribute("khoaList", khoaService.getAll());
            model.addAttribute("error", "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
            return "sinhvien";
        }
        try {
            if (sinhVienRepository.existsById(sinhVienReq.getMaSV())) {
                sinhVienService.update(sinhVienReq.getMaSV(), sinhVienReq);
                redirectAttributes.addFlashAttribute("success", "Cập nhật sinh viên thành công!");
            } else {
                sinhVienService.create(sinhVienReq);
                redirectAttributes.addFlashAttribute("success", "Thêm sinh viên thành công!");
            }
        } catch (IllegalArgumentException | NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/sinhvien?page=" + page;
    }

    @GetMapping("/edit/{maSV}")
    public String editSinhVien(
            @PathVariable String maSV,
            @RequestParam(defaultValue = "0") int page,
            Model model) {
        try {
            SinhVien_DTO_Resp sinhVienResp = sinhVienService.getById(maSV);
            SinhVien_DTO_Req sinhVienReq = new SinhVien_DTO_Req();
            sinhVienReq.setMaSV(sinhVienResp.getMaSV());
            sinhVienReq.setHoVaTen(sinhVienResp.getHoVaTen());
            sinhVienReq.setNgaySinh(sinhVienResp.getNgaySinh());
            sinhVienReq.setGioiTinh(sinhVienResp.getGioiTinh());
            sinhVienReq.setEmail(sinhVienResp.getEmail());
            sinhVienReq.setMaLop(sinhVienResp.getMaLop());
            sinhVienReq.setMaKhoaHoc(sinhVienResp.getMaKhoaHoc());
            model.addAttribute("sinhVien_DTO_", sinhVienReq);
            model.addAttribute("sinhVienPage", sinhVienService.getAll(PageRequest.of(page, 5)));
            model.addAttribute("lopList", lopService.getAll());
            model.addAttribute("khoaHocList", khoaHocService.getAll());
            model.addAttribute("khoaList", khoaService.getAll());
            return "sinhvien";
        } catch (NotFoundException ex) {
            model.addAttribute("error", "Sinh viên không tồn tại.");
            model.addAttribute("sinhVienPage", sinhVienService.getAll(PageRequest.of(page, 5)));
            model.addAttribute("sinhVien_DTO_", new SinhVien_DTO_Req());
            model.addAttribute("lopList", lopService.getAll());
            model.addAttribute("khoaHocList", khoaHocService.getAll());
            model.addAttribute("khoaList", khoaService.getAll());
            return "sinhvien";
        }
    }

    @GetMapping("/delete/{maSV}")
    public String deleteSinhVien(
            @PathVariable String maSV,
            @RequestParam(defaultValue = "0") int page,
            RedirectAttributes redirectAttributes) {
        try {
            sinhVienService.delete(maSV);
            redirectAttributes.addFlashAttribute("success", "Xóa sinh viên thành công!");
        } catch (NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: Sinh viên không tồn tại.");
        }
        return "redirect:/sinhvien?page=" + page;
    }

    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportExcel() {
        List<SinhVien_DTO_Resp> sinhViens = sinhVienService.getAllForExport();
        ByteArrayInputStream in = sinhVienService.exportToExcel(sinhViens);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=sinhvien.xlsx");
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(in));
    }

    @PostMapping("/import")
    public String importExcel(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "0") int page,
            Model model,
            RedirectAttributes redirectAttributes) {
        try {
            List<SinhVien_DTO_Resp> importedSinhViens = sinhVienService.importFromExcel(file);
            redirectAttributes.addFlashAttribute("success", "Nhập " + importedSinhViens.size() + " sinh viên thành công!");
        } catch (RuntimeException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/sinhvien?page=" + page;
    }
}