package com.example.student.management.controller;

import com.example.student.management.dto.req.DiemHocTap_DTO_Req;
import com.example.student.management.dto.resp.DiemHocTap_DTO_Resp;
import com.example.student.management.dto.resp.HocPhan_DTO_Resp;
import com.example.student.management.dto.resp.KhoaHoc_DTO_Resp;
import com.example.student.management.dto.resp.Khoa_DTO_Resp;
import com.example.student.management.dto.resp.Lop_DTO_Resp;
import com.example.student.management.dto.resp.SinhVien_DTO_Resp;
import com.example.student.management.enums.Dot;
import com.example.student.management.enums.HocKi;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.service.DiemHocTap_Service;
import com.example.student.management.service.HocPhan_Service;
import com.example.student.management.service.KhoaHoc_Service;
import com.example.student.management.service.Khoa_Service;
import com.example.student.management.service.Lop_Service;
import com.example.student.management.service.SinhVien_Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.ByteArrayInputStream;
import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("/diemhoctap")
public class DiemHocTapController {

    @Autowired
    private DiemHocTap_Service diemHocTapService;

    @Autowired
    private SinhVien_Service sinhVienService;

    @Autowired
    private HocPhan_Service hocPhanService;

    @Autowired
    private Lop_Service lopService;

    @Autowired
    private KhoaHoc_Service khoaHocService;

    @Autowired
    private Khoa_Service khoaService;

    @GetMapping
    public String listDiemHocTap(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String maSV,
            @RequestParam(required = false) String maHocPhan,
            @RequestParam(required = false) HocKi hocKy,
            @RequestParam(required = false) Dot dot,
            @RequestParam(required = false) String diemChu, // Thay DiemChu bằng String
            @RequestParam(required = false) String maLop,
            @RequestParam(required = false) String maKhoaHoc,
            @RequestParam(required = false) String maKhoa,
            Model model) {
        Page<DiemHocTap_DTO_Resp> diemHocTapPage;
        PageRequest pageable = PageRequest.of(page, size);

        if (maSV != null && !maSV.isEmpty()) {
            diemHocTapPage = diemHocTapService.findByMaSV(maSV, pageable);
        } else if (maHocPhan != null && !maHocPhan.isEmpty()) {
            diemHocTapPage = diemHocTapService.findByMaHocPhan(maHocPhan, pageable);
        } else if (hocKy != null) {
            diemHocTapPage = diemHocTapService.findByHocKy(hocKy, pageable);
        } else if (dot != null) {
            diemHocTapPage = diemHocTapService.findByDot(dot, pageable);
        } else if (diemChu != null && !diemChu.isEmpty()) {
            diemHocTapPage = diemHocTapService.findByDiemChu(diemChu, pageable);
        } else {
            diemHocTapPage = diemHocTapService.findAll(pageable);
        }

        List<SinhVien_DTO_Resp> sinhVienList = sinhVienService.getAllForExport();
        List<HocPhan_DTO_Resp> hocPhanList = hocPhanService.getAll();
        List<Lop_DTO_Resp> lopList = lopService.getAll();
        List<KhoaHoc_DTO_Resp> khoaHocList = khoaHocService.getAll();
        List<Khoa_DTO_Resp> khoaList = khoaService.getAll();
        List<HocKi> hocKyList = Arrays.asList(HocKi.values());
        List<Dot> dotList = Arrays.asList(Dot.values());

        model.addAttribute("diemHocTapPage", diemHocTapPage);
        model.addAttribute("diemHocTap_DTO_", new DiemHocTap_DTO_Req());
        model.addAttribute("sinhVienList", sinhVienList);
        model.addAttribute("hocPhanList", hocPhanList);
        model.addAttribute("lopList", lopList);
        model.addAttribute("khoaHocList", khoaHocList);
        model.addAttribute("khoaList", khoaList);
        model.addAttribute("hocKyList", hocKyList);
        model.addAttribute("dotList", dotList);
        model.addAttribute("maSV", maSV);
        model.addAttribute("maHocPhan", maHocPhan);
        model.addAttribute("hocKy", hocKy);
        model.addAttribute("dot", dot);
        model.addAttribute("diemChu", diemChu);
        model.addAttribute("maLop", maLop);
        model.addAttribute("maKhoaHoc", maKhoaHoc);
        model.addAttribute("maKhoa", maKhoa);
        return "diemhoctap";
    }

    @PostMapping("/save")
    public String saveDiemHocTap(
            @Valid @ModelAttribute("diemHocTap_DTO_") DiemHocTap_DTO_Req diemHocTapReq,
            BindingResult result,
            @RequestParam(defaultValue = "0") int page,
            Model model,
            RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("diemHocTapPage", diemHocTapService.findAll(PageRequest.of(page, 5)));
            model.addAttribute("sinhVienList", sinhVienService.getAllForExport());
            model.addAttribute("hocPhanList", hocPhanService.getAll());
            model.addAttribute("lopList", lopService.getAll());
            model.addAttribute("khoaHocList", khoaHocService.getAll());
            model.addAttribute("khoaList", khoaService.getAll());
            model.addAttribute("hocKyList", Arrays.asList(HocKi.values()));
            model.addAttribute("dotList", Arrays.asList(Dot.values()));
            model.addAttribute("error", "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
            return "diemhoctap";
        }
        try {
            diemHocTapService.create(diemHocTapReq);
            redirectAttributes.addFlashAttribute("success", "Thêm điểm học tập thành công!");
        } catch (IllegalArgumentException | NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/diemhoctap?page=" + page;
    }

    @GetMapping("/edit/{id}")
    public String editDiemHocTap(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "0") int page,
            Model model) {
        try {
            DiemHocTap_DTO_Resp diemHocTapResp = diemHocTapService.findById(id);
            DiemHocTap_DTO_Req diemHocTapReq = new DiemHocTap_DTO_Req();
            diemHocTapReq.setId(id);
            diemHocTapReq.setMaSV(diemHocTapResp.getMaSV());
            diemHocTapReq.setMaHocPhan(diemHocTapResp.getMaHocPhan());
            diemHocTapReq.setHocKy(diemHocTapResp.getHocKy());
            diemHocTapReq.setNamHoc(diemHocTapResp.getNamHoc());
            diemHocTapReq.setDot(diemHocTapResp.getDot());
            diemHocTapReq.setDiemThang10(diemHocTapResp.getDiemThang10());
            diemHocTapReq.setDiemThang4(diemHocTapResp.getDiemThang4());
            diemHocTapReq.setDiemChu(diemHocTapResp.getDiemChu());
            model.addAttribute("diemHocTap_DTO_", diemHocTapReq);
            model.addAttribute("diemHocTapPage", diemHocTapService.findAll(PageRequest.of(page, 5)));
            model.addAttribute("sinhVienList", sinhVienService.getAllForExport());
            model.addAttribute("hocPhanList", hocPhanService.getAll());
            model.addAttribute("lopList", lopService.getAll());
            model.addAttribute("khoaHocList", khoaHocService.getAll());
            model.addAttribute("khoaList", khoaService.getAll());
            model.addAttribute("hocKyList", Arrays.asList(HocKi.values()));
            model.addAttribute("dotList", Arrays.asList(Dot.values()));
            return "diemhoctap";
        } catch (NotFoundException ex) {
            model.addAttribute("error", "Điểm học tập không tồn tại.");
            model.addAttribute("diemHocTapPage", diemHocTapService.findAll(PageRequest.of(page, 5)));
            model.addAttribute("diemHocTap_DTO_", new DiemHocTap_DTO_Req());
            model.addAttribute("sinhVienList", sinhVienService.getAllForExport());
            model.addAttribute("hocPhanList", hocPhanService.getAll());
            model.addAttribute("lopList", lopService.getAll());
            model.addAttribute("khoaHocList", khoaHocService.getAll());
            model.addAttribute("khoaList", khoaService.getAll());
            model.addAttribute("hocKyList", Arrays.asList(HocKi.values()));
            model.addAttribute("dotList", Arrays.asList(Dot.values()));
            return "diemhoctap";
        }
    }

    @PostMapping("/update/{id}")
    public String updateDiemHocTap(
            @PathVariable Integer id,
            @Valid @ModelAttribute("diemHocTap_DTO_") DiemHocTap_DTO_Req diemHocTapReq,
            BindingResult result,
            @RequestParam(defaultValue = "0") int page,
            Model model,
            RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("diemHocTapPage", diemHocTapService.findAll(PageRequest.of(page, 5)));
            model.addAttribute("sinhVienList", sinhVienService.getAllForExport());
            model.addAttribute("hocPhanList", hocPhanService.getAll());
            model.addAttribute("lopList", lopService.getAll());
            model.addAttribute("khoaHocList", khoaHocService.getAll());
            model.addAttribute("khoaList", khoaService.getAll());
            model.addAttribute("hocKyList", Arrays.asList(HocKi.values()));
            model.addAttribute("dotList", Arrays.asList(Dot.values()));
            model.addAttribute("error", "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
            return "diemhoctap";
        }
        try {
            diemHocTapService.update(id, diemHocTapReq);
            redirectAttributes.addFlashAttribute("success", "Cập nhật điểm học tập thành công!");
        } catch (IllegalArgumentException | NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/diemhoctap?page=" + page;
    }

    @GetMapping("/delete/{id}")
    public String deleteDiemHocTap(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "0") int page,
            RedirectAttributes redirectAttributes) {
        try {
            diemHocTapService.delete(id);
            redirectAttributes.addFlashAttribute("success", "Xóa điểm học tập thành công!");
        } catch (NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: Điểm học tập không tồn tại.");
        }
        return "redirect:/diemhoctap?page=" + page;
    }

    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportExcel() {
        List<DiemHocTap_DTO_Resp> diemHocTaps = diemHocTapService.findAll(Pageable.unpaged()).getContent();
        ByteArrayInputStream in = diemHocTapService.exportToExcel(diemHocTaps);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=diemhoctap.xlsx");
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(in));
    }

    @PostMapping("/import")
    public String importExcel(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "0") int page,
            RedirectAttributes redirectAttributes) {
        try {
            List<DiemHocTap_DTO_Resp> importedDiemHocTaps = diemHocTapService.importFromExcel(file);
            redirectAttributes.addFlashAttribute("success", "Nhập " + importedDiemHocTaps.size() + " điểm học tập thành công!");
        } catch (RuntimeException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/diemhoctap?page=" + page;
    }
}