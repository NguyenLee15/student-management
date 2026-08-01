package com.example.student.management.controller.api;

import com.example.student.management.dto.req.SinhVien_DTO_Req;
import com.example.student.management.dto.resp.ApiResponse;
import com.example.student.management.dto.resp.SinhVien_DTO_Resp;
import com.example.student.management.service.SinhVien_Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/v1/sinhvien")
@Tag(name = "Sinh Viên API", description = "Quản lý sinh viên, tìm kiếm, lọc, import/export Excel")
public class SinhVienRestController {

    @Autowired
    private SinhVien_Service sinhVienService;

    @GetMapping
    @Operation(summary = "Lấy danh sách hoặc tìm kiếm/lọc sinh viên có phân trang")
    public ResponseEntity<ApiResponse<Page<SinhVien_DTO_Resp>>> getSinhViens(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "maSV") String sortBy,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String maLop,
            @RequestParam(required = false) String maKhoa,
            @RequestParam(required = false) String maKhoaHoc) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortBy));
        Page<SinhVien_DTO_Resp> result = sinhVienService.searchAndFilter(keyword, maLop, maKhoa, maKhoaHoc, pageRequest);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sinh viên thành công", result));
    }

    @GetMapping("/{maSV}")
    @Operation(summary = "Lấy thông tin sinh viên theo Mã SV")
    public ResponseEntity<ApiResponse<SinhVien_DTO_Resp>> getByMaSV(@PathVariable String maSV) {
        SinhVien_DTO_Resp sinhVien = sinhVienService.getById(maSV);
        return ResponseEntity.ok(ApiResponse.success(sinhVien));
    }

    @PostMapping
    @Operation(summary = "Thêm mới sinh viên")
    public ResponseEntity<ApiResponse<SinhVien_DTO_Resp>> create(@Valid @RequestBody SinhVien_DTO_Req dto) {
        SinhVien_DTO_Resp created = sinhVienService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới sinh viên thành công", created));
    }

    @PutMapping("/{maSV}")
    @Operation(summary = "Cập nhật thông tin sinh viên")
    public ResponseEntity<ApiResponse<SinhVien_DTO_Resp>> update(
            @PathVariable String maSV,
            @Valid @RequestBody SinhVien_DTO_Req dto) {
        SinhVien_DTO_Resp updated = sinhVienService.update(maSV, dto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật sinh viên thành công", updated));
    }

    @DeleteMapping("/{maSV}")
    @Operation(summary = "Xóa sinh viên theo Mã SV")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String maSV) {
        sinhVienService.delete(maSV);
        return ResponseEntity.ok(ApiResponse.success("Xóa sinh viên thành công", null));
    }

    @PostMapping("/import")
    @Operation(summary = "Import danh sách sinh viên từ file Excel (.xlsx)")
    public ResponseEntity<ApiResponse<List<SinhVien_DTO_Resp>>> importExcel(@RequestParam("file") MultipartFile file) {
        List<SinhVien_DTO_Resp> imported = sinhVienService.importFromExcel(file);
        return ResponseEntity.ok(ApiResponse.success("Import Excel thành công", imported));
    }

    @GetMapping("/export")
    @Operation(summary = "Export danh sách sinh viên ra file Excel (.xlsx)")
    public ResponseEntity<InputStreamResource> exportExcel() {
        List<SinhVien_DTO_Resp> list = sinhVienService.getAllForExport();
        ByteArrayInputStream in = sinhVienService.exportToExcel(list);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=sinhvien_export.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}
