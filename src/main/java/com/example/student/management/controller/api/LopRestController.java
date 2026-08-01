package com.example.student.management.controller.api;

import com.example.student.management.dto.req.Lop_DTO_Req;
import com.example.student.management.dto.resp.ApiResponse;
import com.example.student.management.dto.resp.Lop_DTO_Resp;
import com.example.student.management.service.Lop_Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lop")
@Tag(name = "Lớp Học API", description = "Quản lý lớp sinh viên, lọc theo Khoa & phân trang")
public class LopRestController {

    @Autowired
    private Lop_Service lopService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả các lớp (Phân trang hoặc Lấy tất cả)")
    public ResponseEntity<ApiResponse<Object>> getAllLop(
            @RequestParam(required = false) String maKhoa,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean unpaged) {

        if (unpaged) {
            List<Lop_DTO_Resp> list = lopService.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy tất cả các lớp thành công", list));
        }

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("maLop"));
        Page<Lop_DTO_Resp> result;
        if (maKhoa != null && !maKhoa.trim().isEmpty()) {
            result = lopService.getByMaKhoa(maKhoa, pageRequest);
        } else {
            result = lopService.getAll(pageRequest);
        }
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp thành công", result));
    }

    @GetMapping("/{maLop}")
    @Operation(summary = "Lấy thông tin chi tiết lớp học theo Mã Lớp")
    public ResponseEntity<ApiResponse<Lop_DTO_Resp>> getById(@PathVariable String maLop) {
        Lop_DTO_Resp lop = lopService.getById(maLop);
        return ResponseEntity.ok(ApiResponse.success(lop));
    }

    @PostMapping
    @Operation(summary = "Thêm mới lớp học")
    public ResponseEntity<ApiResponse<Lop_DTO_Resp>> create(@Valid @RequestBody Lop_DTO_Req dto) {
        Lop_DTO_Resp created = lopService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo mới lớp thành công", created));
    }

    @PutMapping("/{maLop}")
    @Operation(summary = "Cập nhật thông tin lớp học")
    public ResponseEntity<ApiResponse<Lop_DTO_Resp>> update(
            @PathVariable String maLop,
            @Valid @RequestBody Lop_DTO_Req dto) {
        Lop_DTO_Resp updated = lopService.update(maLop, dto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lớp thành công", updated));
    }

    @DeleteMapping("/{maLop}")
    @Operation(summary = "Xóa lớp học theo Mã Lớp")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String maLop) {
        lopService.delete(maLop);
        return ResponseEntity.ok(ApiResponse.success("Xóa lớp thành công", null));
    }
}
