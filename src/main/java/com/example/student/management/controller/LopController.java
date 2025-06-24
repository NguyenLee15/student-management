package com.example.student.management.controller;

import java.io.ByteArrayInputStream;
import java.util.List;

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

import com.example.student.management.dto.req.Lop_DTO_Req;
import com.example.student.management.dto.resp.Lop_DTO_Resp;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.repository.Khoa_Repository;
import com.example.student.management.service.Lop_Service;

@Controller
@RequestMapping("/lop")
public class LopController {

    @Autowired
    private Lop_Service lopService;

    @Autowired
    private Khoa_Repository khoaRepository;

    @GetMapping
    public String listLop(@RequestParam(defaultValue = "0") int page,
                          @RequestParam(defaultValue = "5") int size,
                          @RequestParam(required = false) String maKhoa,
                          @RequestParam(required = false) String keyword,
                          Model model) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Lop_DTO_Resp> lopPage;

        if (maKhoa != null && !maKhoa.isEmpty()) {
            lopPage = lopService.getByMaKhoa(maKhoa, pageable);
        } else {
            lopPage = lopService.getAll(pageable);
        }

        model.addAttribute("lopPage", lopPage);
        model.addAttribute("lopReq", new Lop_DTO_Req());
        model.addAttribute("khoaList", khoaRepository.findAll());
        model.addAttribute("maKhoa", maKhoa);
        model.addAttribute("keyword", keyword);
        return "lop";
    }

    @PostMapping("/save")
    public String saveLop(@Valid @ModelAttribute("lopReq") Lop_DTO_Req lopReq,
                          BindingResult result,
                          @RequestParam(defaultValue = "0") int page,
                          Model model) {
        if (result.hasErrors()) {
            model.addAttribute("lopPage", lopService.getAll(PageRequest.of(page, 5)));
            model.addAttribute("khoaList", khoaRepository.findAll());
            return "lop";
        }
        if (lopService.existsById(lopReq.getMaLop())) {
            lopService.update(lopReq.getMaLop(), lopReq);
        } else {
            lopService.create(lopReq);
        }
        return "redirect:/lop?page=" + page;
    }

    @GetMapping("/edit/{maLop}")
    public String editLop(@PathVariable String maLop,
                          @RequestParam(defaultValue = "0") int page,
                          Model model) {
        Lop_DTO_Resp lop = lopService.getById(maLop);
        model.addAttribute("lopReq", lop);
        model.addAttribute("lopPage", lopService.getAll(PageRequest.of(page, 5)));
        model.addAttribute("khoaList", khoaRepository.findAll());
        return "lop";
    }

    @GetMapping("/delete/{maLop}")
    public String deleteLop(@PathVariable String maLop,
                           @RequestParam(defaultValue = "0") int page,
                           Model model) {
        try {
            lopService.delete(maLop);
        } catch (NotFoundException ex) {
            model.addAttribute("error", ex.getMessage());
            model.addAttribute("lopPage", lopService.getAll(PageRequest.of(page, 5)));
            model.addAttribute("lopReq", new Lop_DTO_Req());
            model.addAttribute("khoaList", khoaRepository.findAll());
            return "lop";
        }
        return "redirect:/lop?page=" + page;
    }

    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportLopExcel() {
        Page<Lop_DTO_Resp> lopPage = lopService.getAll(Pageable.unpaged());
        List<Lop_DTO_Resp> lopList = lopPage.getContent();
        ByteArrayInputStream in = lopService.exportToExcel(lopList);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=lop.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(in));
    }

    @PostMapping("/import")
    public String importLopExcel(@RequestParam("file") MultipartFile file,
                                 @RequestParam(defaultValue = "0") int page) {
        if (!file.isEmpty()) {
            lopService.importFromExcel(file);
        }
        return "redirect:/lop?page=" + page;
    }
}