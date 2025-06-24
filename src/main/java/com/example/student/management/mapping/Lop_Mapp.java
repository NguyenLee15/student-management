package com.example.student.management.mapping;

import java.util.List;
import java.util.stream.Collectors;

import com.example.student.management.dto.req.Lop_DTO_Req;
import com.example.student.management.dto.resp.Lop_DTO_Resp;
import com.example.student.management.entity.Khoa;
import com.example.student.management.entity.Lop;

public class Lop_Mapp {

    // Mapping từ DTO request → Entity
    public static Lop toEntity(Lop_DTO_Req dto, Khoa khoa) {
        
        if (dto == null) return null;
        Lop lop = new Lop();
        lop.setMaLop(dto.getMaLop());
        lop.setTenLop(dto.getTenLop());
        lop.setKhoa(khoa); // cần truyền entity Khoa vào
        return lop;
    }

    // Mapping từ Entity → DTO response
    public static Lop_DTO_Resp toDTOResp(Lop lop) {
        
        if (lop == null) return null;
        Lop_DTO_Resp resp = new Lop_DTO_Resp();
        resp.setMaLop(lop.getMaLop());
        resp.setTenLop(lop.getTenLop());
        resp.setMaKhoa(lop.getKhoa().getMaKhoa());
        resp.setTenKhoa(lop.getKhoa().getTenKhoa());
        return resp;
    }

     public static List<Lop_DTO_Resp> toDTORespList(List<Lop> entities) {
        return entities.stream()
                .map(Lop_Mapp::toDTOResp) // dùng method đã viết
                .collect(Collectors.toList());
    }
}
