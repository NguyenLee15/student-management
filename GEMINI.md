# NGUYÊN TẮC BẮT BUỘC — KHÔNG ĐƯỢC VI PHẠM

1. **CHỈ LÀM ĐÚNG YÊU CẦU**: Không tự ý mở rộng phạm vi công việc, không "tiện thể" làm thêm việc chưa được yêu cầu. Nếu thấy cần làm thêm, PHẢI hỏi trước, không tự quyết.
2. **KHÔNG BỊA THÔNG TIN**: Nếu không chắc chắn, không tìm thấy, hoặc không thể xác minh — phải nói rõ "không xác định được / không tìm thấy", TUYỆT ĐỐI không suy đoán rồi trình bày như sự thật.
3. **BÁO CÁO PHẢI CÓ BẰNG CHỨNG**: Mọi báo cáo "đã hoàn thành X" phải kèm bằng chứng cụ thể (log, output, đường dẫn file, kết quả lệnh...). Không có bằng chứng = không được báo là đã làm.
4. **PHÂN BIỆT RÕ "ĐÃ LÀM" vs "DỰ ĐỊNH LÀM"**: Không được dùng ngôn ngữ mập mờ khiến người đọc hiểu nhầm việc chưa xong là đã xong.
5. **BÁO LỖI THẬT**: Nếu gặp lỗi, thất bại, hoặc không làm được — phải báo cáo đúng lỗi đó, không che giấu, không làm giảm nhẹ mức độ nghiêm trọng.
6. **TỰ ĐỘNG KIỂM TRA LỖI SAU MỖI LẦN CODE (AUTOMATED VERIFICATION)**: Sau bất kỳ lần viết hoặc sửa mã nguồn nào, PHẢI tự động chạy lệnh kiểm tra lỗi cú pháp và build (`npm run check`, `npm run build` đối với Frontend, `mvn test` đối với Backend). TUYỆT ĐỐI không được kết thúc lượt hoặc báo hoàn thành khi chưa tự động chạy lệnh kiểm tra và xác nhận 0 lỗi.
7. **QUY TRÌNH AUDIT & LẬP PLAN (AUDIT $\rightarrow$ PLAN $\rightarrow$ PHÊ DUYỆT MỚI SỬA)**: Khi người dùng yêu cầu "Audit", "Kiểm tra", "Đánh giá", "Rà soát" — TUYỆT ĐỐI KHÔNG tự ý sửa code. PHẢI chỉ rõ các lỗi/điểm chưa tối ưu, lập bản kế hoạch (Implementation Plan) giải pháp và DỪNG LẠI chờ người dùng duyệt/chấp thuận mới được bắt đầu viết hoặc sửa code.

---

# TIÊU CHUẨN NÂNG CẤP DỰ ÁN & PROFILE GITHUB (PORTFOLIO EXCELLENCE)

1. **XÂY DỰNG & THÊM DỰ ÁN MỚI**: Khởi tạo dự án chất lượng cao, đẩy code chuẩn Git Workflow với lịch sử commit chỉn chu, tự nhiên, tuân thủ định dạng Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`, `test:`, `docs:`).
2. **REFACTOR & TỐI ƯU DỰ ÁN**: Tái cấu trúc code theo chuẩn Design Patterns và Clean Architecture (phân tầng rõ ràng, tách biệt business logic, xử lý lỗi an toàn, giao diện hoàn thiện không lỗi vặt), giúp dự án đạt chuẩn chuyên nghiệp gây ấn tượng mạnh với Nhà tuyển dụng / Hội đồng đánh giá.
3. **ĐẢM BẢO TÍNH LEGIT & TỰ NHIÊN**: Thiết lập lịch sử đóng góp (commit history) và tiến trình phát triển hợp lý theo từng sprint/tính năng logic, không commit dồn cục một lần.