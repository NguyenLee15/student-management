package com.example.student.management.controller;

import jakarta.validation.Valid;

import java.io.ByteArrayInputStream;

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

import com.example.student.management.dto.req.HocPhan_DTO_Req;
import com.example.student.management.dto.resp.HocPhan_DTO_Resp;
import com.example.student.management.enums.LoaiHocPhan;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.repository.Khoa_Repository;
import com.example.student.management.service.HocPhan_Service;

@Controller
@RequestMapping("/hocphan")
public class HocPhanController {

    @Autowired
    private HocPhan_Service hocPhanService;

    @Autowired
    private Khoa_Repository khoaRepository;

    @GetMapping
    public String listHocPhan(@RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "5") int size,
                              @RequestParam(required = false) String loaiHocPhan,
                              @RequestParam(required = false) String maKhoa,
                              @RequestParam(required = false) String keyword,
                              Model model) {
        Page<HocPhan_DTO_Resp> hocPhanPage;

        if (loaiHocPhan != null && !loaiHocPhan.isEmpty()) {
            hocPhanPage = hocPhanService.searchByLoaiHocPhan(LoaiHocPhan.valueOf(loaiHocPhan), page, size);
        } else if (maKhoa != null && !maKhoa.isEmpty()) {
            hocPhanPage = hocPhanService.searchByMaKhoa(maKhoa, page, size);
        } else {
            hocPhanPage = hocPhanService.getAll(page, size);
        }

        model.addAttribute("hocPhanPage", hocPhanPage);
        model.addAttribute("hocPhanReq", new HocPhan_DTO_Req());
        model.addAttribute("loaiHocPhanList", LoaiHocPhan.values());
        model.addAttribute("khoaList", khoaRepository.findAll());
        model.addAttribute("selectedLoaiHocPhan", loaiHocPhan);
        model.addAttribute("selectedMaKhoa", maKhoa);
        model.addAttribute("keyword", keyword);
        return "hocphan";
    }

    @PostMapping("/save")
    public String saveHocPhan(@Valid @ModelAttribute("hocPhanReq") HocPhan_DTO_Req hocPhanReq,
                              BindingResult result,
                              @RequestParam(defaultValue = "0") int page,
                              Model model) {
        if (result.hasErrors()) {
            model.addAttribute("hocPhanPage", hocPhanService.getAll(page, 5));
            model.addAttribute("loaiHocPhanList", LoaiHocPhan.values());
            model.addAttribute("khoaList", khoaRepository.findAll());
            return "hocphan";
        }
        if (hocPhanService.getById(hocPhanReq.getMaHocPhan()).isPresent()) {
            hocPhanService.update(hocPhanReq.getMaHocPhan(), hocPhanReq);
        } else {
            hocPhanService.create(hocPhanReq);
        }
        return "redirect:/hocphan?page=" + page;
    }

    @GetMapping("/edit/{maHocPhan}")
    public String editHocPhan(@PathVariable String maHocPhan,
                              @RequestParam(defaultValue = "0") int page,
                              Model model) {
        HocPhan_DTO_Resp hocPhan = hocPhanService.getById(maHocPhan)
                .orElseThrow(() -> new NotFoundException("Học phần không tìm thấy: " + maHocPhan));
        model.addAttribute("hocPhanReq", hocPhan);
        model.addAttribute("hocPhanPage", hocPhanService.getAll(page, 5));
        model.addAttribute("loaiHocPhanList", LoaiHocPhan.values());
        model.addAttribute("khoaList", khoaRepository.findAll());
        return "hocphan";
    }

    @GetMapping("/delete/{maHocPhan}")
    public String deleteHocPhan(@PathVariable String maHocPhan,
                               @RequestParam(defaultValue = "0") int page,
                               Model model) {
        try {
            hocPhanService.delete(maHocPhan);
        } catch (NotFoundException ex) {
            model.addAttribute("error", ex.getMessage());
            model.addAttribute("hocPhanPage", hocPhanService.getAll(page, 5));
            model.addAttribute("hocPhanReq", new HocPhan_DTO_Req());
            model.addAttribute("loaiHocPhanList", LoaiHocPhan.values());
            model.addAttribute("khoaList", khoaRepository.findAll());
            return "hocphan";
        }
        return "redirect:/hocphan?page=" + page;
    }

    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportHocPhanExcel() {
        Page<HocPhan_DTO_Resp> hocPhanPage = hocPhanService.getAll(0, Integer.MAX_VALUE);
        ByteArrayInputStream in = hocPhanService.exportToExcel(hocPhanPage);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=hocphan.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(in));
    }

    @PostMapping("/import")
    public String importHocPhanExcel(@RequestParam("file") MultipartFile file,
                                     @RequestParam(defaultValue = "0") int page) {
        if (!file.isEmpty()) {
            hocPhanService.importFromExcel(file);
        }
        return "redirect:/hocphan?page=" + page;
    }
}