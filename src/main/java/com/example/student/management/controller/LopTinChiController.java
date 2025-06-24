package com.example.student.management.controller;

import com.example.student.management.dto.req.LopTinChi_DTO_Req;
import com.example.student.management.dto.resp.SinhVien_DTO_Resp;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.service.HocPhan_Service;
import com.example.student.management.service.LopTinChi_Service;
import com.example.student.management.service.Lop_Service;
import com.example.student.management.service.SinhVien_Service;
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
@RequestMapping("/loptinchi")
public class LopTinChiController {

    @Autowired
    private LopTinChi_Service lopTinChiService;

    @Autowired
    private HocPhan_Service hocPhanService;

    @Autowired
    private SinhVien_Service sinhVienService;

    @Autowired
    private Lop_Service lopService;

    @GetMapping
    public String listLopTinChi(Model model, @RequestParam(defaultValue = "0") int page) {
        Page<LopTinChi_DTO_Req> lopTinChiPage = lopTinChiService.getAllLopTinChi(page, 5);
        model.addAttribute("lopTinChiPage", lopTinChiPage);
        model.addAttribute("lopTinChi", new LopTinChi_DTO_Req());
        model.addAttribute("hocPhanList", hocPhanService.getAll());
        model.addAttribute("lopList", lopService.getAll());
        model.addAttribute("isEdit", false);
        return "loptinchi";
    }

    @PostMapping("/save")
    public String saveLopTinChi(@Valid @ModelAttribute("lopTinChi") LopTinChi_DTO_Req dto,
                                BindingResult result, Model model, RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("lopTinChiPage", lopTinChiService.getAllLopTinChi(0, 5));
            model.addAttribute("hocPhanList", hocPhanService.getAll());
            model.addAttribute("lopList", lopService.getAll());
            model.addAttribute("isEdit", false);
            return "loptinchi";
        }
        try {
            lopTinChiService.saveLopTinChi(dto);
            redirectAttributes.addFlashAttribute("success", "Lưu lớp tín chỉ thành công!");
        } catch (IllegalArgumentException | NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/loptinchi";
    }

    @GetMapping("/edit/{id}")
    public String editLopTinChi(@PathVariable int id, Model model, RedirectAttributes redirectAttributes) {
        try {
            LopTinChi_DTO_Req dto = lopTinChiService.getLopTinChiById(id);
            List<SinhVien_DTO_Resp> sinhVienList = sinhVienService.getSinhVienByLopTinChiId(id);
            model.addAttribute("lopTinChi", dto);
            model.addAttribute("lopTinChiId", id);
            model.addAttribute("hocPhanList", hocPhanService.getAll());
            model.addAttribute("lopList", lopService.getAll());
            model.addAttribute("sinhVienList", sinhVienList);
            model.addAttribute("lopTinChiPage", lopTinChiService.getAllLopTinChi(0, 5));
            model.addAttribute("isEdit", true);
            return "loptinchi";
        } catch (NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lớp tín chỉ không tồn tại.");
            return "redirect:/loptinchi";
        }
    }

    @PostMapping("/update/{id}")
    public String updateLopTinChi(@PathVariable int id,
                                  @Valid @ModelAttribute("lopTinChi") LopTinChi_DTO_Req dto,
                                  BindingResult result, Model model, RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("lopTinChiId", id);
            model.addAttribute("hocPhanList", hocPhanService.getAll());
            model.addAttribute("lopList", lopService.getAll());
            model.addAttribute("sinhVienList", sinhVienService.getSinhVienByLopTinChiId(id));
            model.addAttribute("lopTinChiPage", lopTinChiService.getAllLopTinChi(0, 5));
            model.addAttribute("isEdit", true);
            return "loptinchi";
        }
        try {
            lopTinChiService.updateLopTinChi(id, dto);
            redirectAttributes.addFlashAttribute("success", "Cập nhật lớp tín chỉ thành công!");
        } catch (IllegalArgumentException | NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/loptinchi";
    }

    @GetMapping("/delete/{id}")
    public String deleteLopTinChi(@PathVariable int id, RedirectAttributes redirectAttributes) {
        try {
            lopTinChiService.deleteLopTinChi(id);
            redirectAttributes.addFlashAttribute("success", "Xóa lớp tín chỉ thành công!");
        } catch (NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/loptinchi";
    }

    @PostMapping("/add-students")
    public String addStudentsToLopTinChi(@RequestParam int lopTinChiId,
                                         @RequestParam List<String> maSinhViens,
                                         RedirectAttributes redirectAttributes) {
        try {
            lopTinChiService.addStudentsToLopTinChi(lopTinChiId, maSinhViens);
            redirectAttributes.addFlashAttribute("success", "Thêm sinh viên thành công!");
        } catch (NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/loptinchi/edit/" + lopTinChiId;
    }

    @PostMapping("/remove-student")
    public String removeStudentFromLopTinChi(@RequestParam int lopTinChiId,
                                             @RequestParam String maSinhVien,
                                             RedirectAttributes redirectAttributes) {
        try {
            lopTinChiService.removeStudentFromLopTinChi(lopTinChiId, maSinhVien);
            redirectAttributes.addFlashAttribute("success", "Xóa sinh viên khỏi lớp thành công!");
        } catch (NotFoundException ex) {
            redirectAttributes.addFlashAttribute("error", "Lỗi: " + ex.getMessage());
        }
        return "redirect:/loptinchi/edit/" + lopTinChiId;
    }

    @GetMapping("/get-sinhvien-by-lop")
    @ResponseBody
    public List<SinhVien_DTO_Resp> getSinhVienByLop(@RequestParam String maLop) {
        return sinhVienService.getSinhVienByMaLop(maLop);
    }
}