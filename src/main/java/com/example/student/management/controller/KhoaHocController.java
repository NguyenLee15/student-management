package com.example.student.management.controller;

import com.example.student.management.dto.req.KhoaHoc_DTO_Req;
import com.example.student.management.dto.resp.KhoaHoc_DTO_Resp;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.service.KhoaHoc_Service;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/khoahoc")
public class KhoaHocController {

    private static final int PAGE_SIZE = 5;

    private final KhoaHoc_Service khoaHocService;

    public KhoaHocController(KhoaHoc_Service khoaHocService) {
        this.khoaHocService = khoaHocService;
    }

    @GetMapping
    public String listKhoaHoc(@RequestParam(defaultValue = "0") int page, Model model) {
        Page<KhoaHoc_DTO_Resp> khoaHocPage = khoaHocService.getAll(page, PAGE_SIZE);
        model.addAttribute("khoaHocPage", khoaHocPage);
        model.addAttribute("khoaHocRequest", new KhoaHoc_DTO_Req());
        return "khoahoc";
    }

    @PostMapping("/save")
    public String saveKhoaHoc(@Valid @ModelAttribute("khoaHocRequest") KhoaHoc_DTO_Req khoaHocReq,
                              BindingResult result,
                              @RequestParam(defaultValue = "0") int page,
                              Model model) {

        boolean isEdit = khoaHocService.getById(khoaHocReq.getMaKhoaHoc()).isPresent();

        if (!isEdit && khoaHocService.exists(khoaHocReq.getMaKhoaHoc())) {
            result.rejectValue("maKhoaHoc", "duplicate", "Mã khóa học đã tồn tại.");
        }

        if (result.hasErrors()) {
            model.addAttribute("khoaHocPage", khoaHocService.getAll(page, PAGE_SIZE));
            return "khoahoc";
        }

        if (isEdit) {
            khoaHocService.update(khoaHocReq.getMaKhoaHoc(), khoaHocReq);
        } else {
            khoaHocService.create(khoaHocReq);
        }

        return "redirect:/khoahoc?page=" + page;
    }

    @GetMapping("/edit/{maKhoaHoc}")
    public String editKhoaHoc(@PathVariable String maKhoaHoc,
                              @RequestParam(defaultValue = "0") int page,
                              Model model) {
        KhoaHoc_DTO_Resp khoaHoc = khoaHocService.getById(maKhoaHoc)
                .orElseThrow(() -> new NotFoundException("Khóa học không tìm thấy: " + maKhoaHoc));

        model.addAttribute("khoaHocRequest", khoaHoc);
        model.addAttribute("khoaHocPage", khoaHocService.getAll(page, PAGE_SIZE));
        return "khoahoc";
    }

    @GetMapping("/delete/{maKhoaHoc}")
    public String deleteKhoaHoc(@PathVariable String maKhoaHoc,
                                @RequestParam(defaultValue = "0") int page,
                                Model model) {
        try {
            khoaHocService.delete(maKhoaHoc);
        } catch (NotFoundException ex) {
            model.addAttribute("error", ex.getMessage());
            model.addAttribute("khoaHocPage", khoaHocService.getAll(page, PAGE_SIZE));
            model.addAttribute("khoaHocRequest", new KhoaHoc_DTO_Req());
            return "khoahoc";
        }

        return "redirect:/khoahoc?page=" + page;
    }
}
