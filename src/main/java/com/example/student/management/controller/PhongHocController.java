package com.example.student.management.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.student.management.dto.req.PhongHoc_DTO_Req;
import com.example.student.management.dto.resp.PhongHoc_DTO_Resp;
import com.example.student.management.enums.ToaNha;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.service.PhongHoc_Service;

@Controller
@RequestMapping("/phonghoc")
public class PhongHocController {

    @Autowired
    private PhongHoc_Service phongHocService;

    @GetMapping
    public String listPhongHoc(@RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "5") int size,
                               @RequestParam(required = false) String toaNha,
                               @RequestParam(required = false) String keyword,
                               Model model) {
        Page<PhongHoc_DTO_Resp> phongHocPage;

        if (toaNha != null && !toaNha.isEmpty()) {
            try {
                ToaNha toaNhaEnum = ToaNha.valueOf(toaNha);
                phongHocPage = phongHocService.searchByToaNha(toaNhaEnum, PageRequest.of(page, size));
            } catch (IllegalArgumentException e) {
                model.addAttribute("error", "Tòa nhà không hợp lệ: " + toaNha);
                phongHocPage = phongHocService.getAll(PageRequest.of(page, size));
            }
        } else {
            phongHocPage = phongHocService.getAll(PageRequest.of(page, size));
        }

        model.addAttribute("phongHocPage", phongHocPage);
        model.addAttribute("phongHocReq", new PhongHoc_DTO_Req());
        model.addAttribute("toaNhaList", ToaNha.values());
        model.addAttribute("selectedToaNha", toaNha);
        model.addAttribute("keyword", keyword);
        return "phonghoc";
    }

    @PostMapping("/save")
public String savePhongHoc(@Valid @ModelAttribute("phongHocReq") PhongHoc_DTO_Req phongHocReq,
                           BindingResult result,
                           @RequestParam(defaultValue = "0") int page,
                           Model model,
                           RedirectAttributes redirectAttributes) {
    if (result.hasErrors()) {
        model.addAttribute("phongHocPage", phongHocService.getAll(PageRequest.of(page, 5)));
        model.addAttribute("toaNhaList", ToaNha.values());
        return "phonghoc";
    }

    try {
        if (phongHocService.existsById(phongHocReq.getMaPhong())) {
            phongHocService.update(phongHocReq.getMaPhong(), phongHocReq);
            redirectAttributes.addFlashAttribute("success", "Cập nhật phòng học thành công!");
        } else {
            phongHocService.create(phongHocReq);
            redirectAttributes.addFlashAttribute("success", "Thêm phòng học mới thành công!");
        }
    } catch (IllegalArgumentException ex) {
        redirectAttributes.addFlashAttribute("error", ex.getMessage());
        return "redirect:/phonghoc?page=" + page;
    } catch (Exception e) {
        redirectAttributes.addFlashAttribute("error", "Đã xảy ra lỗi khi lưu phòng học!");
        return "redirect:/phonghoc?page=" + page;
    }

    return "redirect:/phonghoc?page=" + page;
}


    @GetMapping("/edit/{maPhong}")
    public String editPhongHoc(@PathVariable String maPhong,
                               @RequestParam(defaultValue = "0") int page,
                               Model model) {
        PhongHoc_DTO_Resp phongHoc = phongHocService.getById(maPhong)
                .orElseThrow(() -> new NotFoundException("Phòng học không tìm thấy: " + maPhong));
        model.addAttribute("phongHocReq", phongHoc);
        model.addAttribute("phongHocPage", phongHocService.getAll(PageRequest.of(page, 5)));
        model.addAttribute("toaNhaList", ToaNha.values());
        return "phonghoc";
    }

    @GetMapping("/delete/{maPhong}")
    public String deletePhongHoc(@PathVariable String maPhong,
                                 @RequestParam(defaultValue = "0") int page,
                                 Model model) {
        try {
            phongHocService.delete(maPhong);
        } catch (NotFoundException ex) {
            model.addAttribute("error", ex.getMessage());
            model.addAttribute("phongHocPage", phongHocService.getAll(PageRequest.of(page, 5)));
            model.addAttribute("phongHocReq", new PhongHoc_DTO_Req());
            model.addAttribute("toaNhaList", ToaNha.values());
            return "phonghoc";
        }
        return "redirect:/phonghoc?page=" + page;
    }
}