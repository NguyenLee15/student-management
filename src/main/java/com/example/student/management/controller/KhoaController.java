package com.example.student.management.controller;

import com.example.student.management.dto.req.Khoa_DTO_Req;
import com.example.student.management.dto.resp.Khoa_DTO_Resp;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.service.Khoa_Service;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/khoa")
public class KhoaController {

    private static final Logger logger = LoggerFactory.getLogger(KhoaController.class);

    @Autowired
    private Khoa_Service khoaService;

    @GetMapping
    public String listKhoa(@RequestParam(defaultValue = "0") int page,
                           @RequestParam(defaultValue = "10") int size,
                           Model model) {
        Page<Khoa_DTO_Resp> khoaPage = khoaService.getAll(PageRequest.of(page, size));
        model.addAttribute("khoaPage", khoaPage);
        model.addAttribute("khoaReq", new Khoa_DTO_Req());
        return "khoa";
    }

    @PostMapping("/save")
    public String saveKhoa(@Valid @ModelAttribute("khoaReq") Khoa_DTO_Req khoaReq,
                           BindingResult result,
                           @RequestParam(defaultValue = "0") int page,
                           @RequestParam(defaultValue = "10") int size,
                           Model model) {
        if (result.hasErrors()) {
            logger.warn("Lỗi validation khi lưu khoa: {}", result.getAllErrors());
            Page<Khoa_DTO_Resp> khoaPage = khoaService.getAll(PageRequest.of(page, size));
            model.addAttribute("khoaPage", khoaPage);
            return "khoa";
        }

        try {
            if (khoaService.getById(khoaReq.getMaKhoa()).isPresent()) {
                // Cập nhật khoa
                khoaService.update(khoaReq.getMaKhoa(), khoaReq);
            } else {
                // Thêm mới khoa
                khoaService.create(khoaReq);
            }
        } catch (IllegalArgumentException | NotFoundException ex) {
            result.rejectValue("maKhoa", "error.khoaReq", ex.getMessage());
            Page<Khoa_DTO_Resp> khoaPage = khoaService.getAll(PageRequest.of(page, size));
            model.addAttribute("khoaPage", khoaPage);
            return "khoa";
        }

        return "redirect:/khoa?page=" + page;
    }

    @GetMapping("/edit/{maKhoa}")
    public String editKhoa(@PathVariable String maKhoa, Model model) {
        Khoa_DTO_Resp khoa = khoaService.getById(maKhoa)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khoa: " + maKhoa));
        model.addAttribute("khoaReq", new Khoa_DTO_Req(khoa.getMaKhoa(), khoa.getTenKhoa()));
        model.addAttribute("khoaPage", khoaService.getAll(PageRequest.of(0, 10)));
        return "khoa";
    }

    @GetMapping("/delete/{maKhoa}")
    public String deleteKhoa(@PathVariable String maKhoa,
                             @RequestParam(defaultValue = "0") int page,
                             Model model) {
        try {
            khoaService.delete(maKhoa);
        } catch (NotFoundException ex) {
            model.addAttribute("error", ex.getMessage());
            Page<Khoa_DTO_Resp> khoaPage = khoaService.getAll(PageRequest.of(page, 10));
            model.addAttribute("khoaPage", khoaPage);
            model.addAttribute("khoaReq", new Khoa_DTO_Req());
            return "khoa";
        }
        return "redirect:/khoa?page=" + page;
    }
}