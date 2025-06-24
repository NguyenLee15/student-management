package com.example.student.management.service;

import com.example.student.management.dto.req.LopTinChi_DTO_Req;
import com.example.student.management.dto.resp.LopTinChi_DTO_Resp;
import java.util.List;

import org.springframework.data.domain.Page;

public interface LopTinChi_Service {
    List<LopTinChi_DTO_Resp> getAll();
    Page<LopTinChi_DTO_Req> getAllLopTinChi(int page, int size);
    LopTinChi_DTO_Req getLopTinChiById(int id);
    void saveLopTinChi(LopTinChi_DTO_Req request);
    void updateLopTinChi(int id, LopTinChi_DTO_Req request);
    void deleteLopTinChi(int id);
    void addStudentsToLopTinChi(int id, List<String> maSinhViens);
    void removeStudentFromLopTinChi(int id, String maSinhVien);
}