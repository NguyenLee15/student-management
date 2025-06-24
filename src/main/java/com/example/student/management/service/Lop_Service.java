package com.example.student.management.service;

import java.io.ByteArrayInputStream;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.example.student.management.dto.req.Lop_DTO_Req;
import com.example.student.management.dto.resp.Lop_DTO_Resp;


public interface Lop_Service {
    
     // Tìm lớp theo mã khoa (phân trang)
    Page<Lop_DTO_Resp> getByMaKhoa(String maKhoa, Pageable pageable);

    // Lấy tất cả lớp (phân trang)
    Page<Lop_DTO_Resp> getAll(Pageable pageable);

    // Thêm lớp mới
    Lop_DTO_Resp create(Lop_DTO_Req dto);

    // Cập nhật lớp
    Lop_DTO_Resp update(String maLop, Lop_DTO_Req dto);

    // Xoá lớp theo mã lớp
    void delete(String maLop);

    // Kiểm tra mã lớp có tồn tại không
    boolean existsById(String maLop);

    // Lấy một lớp cụ thể
    Lop_DTO_Resp getById(String maLop);
    
    // Import dữ liệu từ Excel
    void importFromExcel(MultipartFile file);
    
    // Xuất danh sách lớp ra định dạng Excel
    public ByteArrayInputStream exportToExcel(List<Lop_DTO_Resp> lopList);
    
    List<Lop_DTO_Resp> getAll();
   
}
