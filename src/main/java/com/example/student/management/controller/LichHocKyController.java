package com.example.student.management.controller;

import com.example.student.management.dto.req.LichHocKy_DTO_Req;
import com.example.student.management.dto.resp.GiangVien_DTO_Resp;
import com.example.student.management.dto.resp.HocPhan_DTO_Resp;
import com.example.student.management.dto.resp.LichHocKy_DTO_Resp;
import com.example.student.management.dto.resp.LopTinChi_DTO_Resp;
import com.example.student.management.dto.resp.PhongHoc_DTO_Resp;
import com.example.student.management.enums.CaHoc;
import com.example.student.management.enums.HocKi;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.service.GiangVien_Service;
import com.example.student.management.service.HocPhan_Service;
import com.example.student.management.service.LichHocKy_Service;
import com.example.student.management.service.LopTinChi_Service;
import com.example.student.management.service.PhongHoc_Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Arrays;
import java.util.List;

/**
 * Controller để quản lý lịch học kỳ.
 */
@Controller
@RequestMapping("/lichhocky")
public class LichHocKyController {

    @Autowired
    private LichHocKy_Service lichHocKyService;

    @Autowired
    private LopTinChi_Service lopTinChiService;

    @Autowired
    private HocPhan_Service hocPhanService;

    @Autowired
    private GiangVien_Service giangVienService;

    @Autowired
    private PhongHoc_Service phongHocService;

    /**
     * Hiển thị trang quản lý lịch học kỳ với phân trang và bộ lọc.
     */
    @GetMapping
    public String listLichHocKy(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String maLopTinChi,
            @RequestParam(required = false) String maHocPhan,
            @RequestParam(required = false) String hocKy,
            @RequestParam(required = false) String namHoc,
            @RequestParam(required = false) String maGiangVien,
            @RequestParam(required = false) String maPhong,
            Model model) {
        Page<LichHocKy_DTO_Resp> lichHocKyPage;
        PageRequest pageable = PageRequest.of(page, size);

        // Áp dụng bộ lọc
        if (maLopTinChi != null && !maLopTinChi.isEmpty()) {
            lichHocKyPage = lichHocKyService.getAll(page, size); // Thêm bộ lọc tùy chỉnh sau
        } else if (maHocPhan != null && !maHocPhan.isEmpty()) {
            lichHocKyPage = lichHocKyService.searchByMaHocPhan(maHocPhan, page, size);
        } else if (hocKy != null && !hocKy.isEmpty()) {
            lichHocKyPage = lichHocKyService.searchByHocKy(hocKy, page, size);
        } else if (namHoc != null && !namHoc.isEmpty()) {
            lichHocKyPage = lichHocKyService.searchByNamHoc(namHoc, page, size);
        } else {
            lichHocKyPage = lichHocKyService.getAll(page, size);
        }

        // Tải dữ liệu cho dropdown
        List<LopTinChi_DTO_Resp> lopTinChiList = lopTinChiService.getAll();
        List<HocPhan_DTO_Resp> hocPhanList = hocPhanService.getAll();
        List<GiangVien_DTO_Resp> giangVienList = giangVienService.getAll();
        List<PhongHoc_DTO_Resp> phongHocList = phongHocService.getAll();
        List<HocKi> hocKyList = Arrays.asList(HocKi.values());
        List<CaHoc> caHocList = Arrays.asList(CaHoc.values());

        model.addAttribute("lichHocKyPage", lichHocKyPage);
        model.addAttribute("lichHocKy_DTO_", new LichHocKy_DTO_Req());
        model.addAttribute("isEdit", false); // Chế độ tạo mới
        model.addAttribute("lopTinChiList", lopTinChiList);
        model.addAttribute("hocPhanList", hocPhanList);
        model.addAttribute("giangVienList", giangVienList);
        model.addAttribute("phongHocList", phongHocList);
        model.addAttribute("hocKyList", hocKyList);
        model.addAttribute("caHocList", caHocList);
        model.addAttribute("maLopTinChi", maLopTinChi);
        model.addAttribute("maHocPhan", maHocPhan);
        model.addAttribute("hocKy", hocKy);
        model.addAttribute("namHoc", namHoc);
        model.addAttribute("maGiangVien", maGiangVien);
        model.addAttribute("maPhong", maPhong);
        return "lichhocky";
    }

    /**
     * Xử lý tạo lịch học kỳ mới.
     */
    @PostMapping("/save")
    public String saveLichHocKy(
            @Valid @ModelAttribute("lichHocKy_DTO_") LichHocKy_DTO_Req lichHocKyReq,
            BindingResult result,
            @RequestParam(defaultValue = "0") int page,
            Model model,
            RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("lichHocKyPage", lichHocKyService.getAll(page, 5));
            model.addAttribute("lopTinChiList", lopTinChiService.getAll());
            model.addAttribute("hocPhanList", hocPhanService.getAll());
            model.addAttribute("giangVienList", giangVienService.getAll());
            model.addAttribute("phongHocList", phongHocService.getAll());
            model.addAttribute("hocKyList", Arrays.asList(HocKi.values()));
            model.addAttribute("caHocList", Arrays.asList(CaHoc.values()));
            model.addAttribute("isEdit", false);
            model.addAttribute("error", "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
            return "lichhocky";
        }
        try {
            lichHocKyService.create(lichHocKyReq);
            redirectAttributes.addFlashAttribute("success", "Thêm lịch học kỳ thành công!");
        } catch (IllegalArgumentException | NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/lichhocky?page=" + page;
    }

    /**
     * Hiển thị form chỉnh sửa lịch học kỳ.
     */
    @GetMapping("/edit/{id}")
    public String editLichHocKy(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "0") int page,
            Model model) {
        try {
            LichHocKy_DTO_Resp lichHocKyResp = lichHocKyService.getById(id)
                    .orElseThrow(() -> new NotFoundException("Lịch học kỳ không tồn tại."));
            LichHocKy_DTO_Req dto = new LichHocKy_DTO_Req();
            dto.setLopTinChiId(lichHocKyResp.getLopTinChiId());
            dto.setMaHocPhan(lichHocKyResp.getMaHocPhan());
            dto.setMaGiangVien(lichHocKyResp.getMaGiangVien());
            dto.setMaPhong(lichHocKyResp.getMaPhong());
            dto.setHocKy(lichHocKyResp.getHocKy());
            dto.setNamHoc(lichHocKyResp.getNamHoc());
            dto.setThoiGianHoc(lichHocKyResp.getThoiGianHoc());
            dto.setCaHoc(lichHocKyResp.getCaHoc());
            dto.setNgayBatDauHoc(lichHocKyResp.getNgayBatDauHoc());
            dto.setNgayKetThucHoc(lichHocKyResp.getNgayKetThucHoc());

            model.addAttribute("lichHocKy_DTO_", dto);
            model.addAttribute("isEdit", true); // Chế độ chỉnh sửa
            model.addAttribute("lichHocKyId", id); // ID cho form action
            model.addAttribute("lichHocKyPage", lichHocKyService.getAll(page, 5));
            model.addAttribute("lopTinChiList", lopTinChiService.getAll());
            model.addAttribute("hocPhanList", hocPhanService.getAll());
            model.addAttribute("giangVienList", giangVienService.getAll());
            model.addAttribute("phongHocList", phongHocService.getAll());
            model.addAttribute("hocKyList", Arrays.asList(HocKi.values()));
            model.addAttribute("caHocList", Arrays.asList(CaHoc.values()));
            return "lichhocky";
        } catch (NotFoundException ex) {
            model.addAttribute("error", "Lịch học kỳ không tồn tại.");
            model.addAttribute("lichHocKyPage", lichHocKyService.getAll(page, 5));
            model.addAttribute("lichHocKy_DTO_", new LichHocKy_DTO_Req());
            model.addAttribute("isEdit", false);
            model.addAttribute("lopTinChiList", lopTinChiService.getAll());
            model.addAttribute("hocPhanList", hocPhanService.getAll());
            model.addAttribute("giangVienList", giangVienService.getAll());
            model.addAttribute("phongHocList", phongHocService.getAll());
            model.addAttribute("hocKyList", Arrays.asList(HocKi.values()));
            model.addAttribute("caHocList", Arrays.asList(CaHoc.values()));
            return "lichhocky";
        }
    }

    /**
     * Xử lý cập nhật lịch học kỳ.
     */
    @PostMapping("/update/{id}")
    public String updateLichHocKy(
            @PathVariable Integer id,
            @Valid @ModelAttribute("lichHocKy_DTO_") LichHocKy_DTO_Req lichHocKyReq,
            BindingResult result,
            @RequestParam(defaultValue = "0") int page,
            Model model,
            RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("lichHocKyPage", lichHocKyService.getAll(page, 5));
            model.addAttribute("lopTinChiList", lopTinChiService.getAll());
            model.addAttribute("hocPhanList", hocPhanService.getAll());
            model.addAttribute("giangVienList", giangVienService.getAll());
            model.addAttribute("phongHocList", phongHocService.getAll());
            model.addAttribute("hocKyList", Arrays.asList(HocKi.values()));
            model.addAttribute("caHocList", Arrays.asList(CaHoc.values()));
            model.addAttribute("isEdit", true);
            model.addAttribute("lichHocKyId", id);
            model.addAttribute("error", "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
            return "lichhocky";
        }
        try {
            lichHocKyService.update(id, lichHocKyReq);
            redirectAttributes.addFlashAttribute("success", "Cập nhật lịch học kỳ thành công!");
        } catch (IllegalArgumentException | NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/lichhocky?page=" + page;
    }

    /**
     * Xóa lịch học kỳ.
     */
    @GetMapping("/delete/{id}")
    public String deleteLichHocKy(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "0") int page,
            RedirectAttributes redirectAttributes) {
        try {
            lichHocKyService.delete(id);
            redirectAttributes.addFlashAttribute("success", "Xóa lịch học kỳ thành công!");
        } catch (NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: Lịch học kỳ không tồn tại.");
        }
        return "redirect:/lichhocky?page=" + page;
    }
}