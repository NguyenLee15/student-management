import os, re

dict_ui = {
    'Student Directory': 'Quản lý Sinh viên',
    'Import Excel': 'Nhập Excel',
    'Export Excel': 'Xuất Excel',
    'New Student': 'Thêm Sinh viên',
    'Teacher Directory': 'Quản lý Giảng viên',
    'New Teacher': 'Thêm Giảng viên',
    'Subject Catalog': 'Quản lý Môn học',
    'New Subject': 'Thêm Môn học',
    'System Audit Logs': 'Nhật ký Hệ thống',
    'Faculty Management': 'Quản lý Khoa',
    'New Faculty': 'Thêm Khoa',
    'Academic Year Cohorts': 'Niên khóa',
    'New Cohort': 'Thêm Niên khóa',
    'Student Class Administration': 'Quản lý Lớp hành chính',
    'New Class': 'Thêm Lớp',
    'Credit Classes & Course Enrolment': 'Lớp tín chỉ & Đăng ký',
    'Classroom & Facility Management': 'Quản lý Phòng học',
    'User Management & Security': 'Quản lý Người dùng & Phân quyền',
    'New User': 'Thêm Người dùng',
    'Schedule & Timetable Management': 'Quản lý Thời khóa biểu',
    'New Schedule': 'Thêm Lịch học',
    'updated successfully!': 'đã cập nhật thành công!',
    'created successfully!': 'đã thêm thành công!',
    'deleted successfully!': 'đã xóa thành công!',
    'exported successfully!': 'đã xuất thành công!',
    'Import Failed:': 'Lỗi nhập dữ liệu:',
    'Import completed with': 'Nhập dữ liệu hoàn tất với',
    'Imported Excel data successfully!': 'Nhập dữ liệu Excel thành công!',
    'Failed to start import': 'Lỗi khi bắt đầu nhập file',
    'Failed exporting Excel file.': 'Xuất file Excel thất bại.',
    'Edit Student: ': 'Sửa Sinh viên: ',
    'Register New Student': 'Đăng ký Sinh viên Mới',
    'Delete Student': 'Xóa Sinh viên',
    'Create Student': 'Thêm Sinh viên',
    'Edit Teacher: ': 'Sửa Giảng viên: ',
    'Register New Teacher': 'Đăng ký Giảng viên Mới',
    'Delete Teacher': 'Xóa Giảng viên',
    'Create Teacher': 'Thêm Giảng viên',
    'Edit Subject: ': 'Sửa Môn học: ',
    'Register New Subject': 'Đăng ký Môn học',
    'Delete Subject': 'Xóa Môn học',
    'Create Subject': 'Thêm Môn học',
    'Delete User': 'Xóa Người dùng',
    'Create User': 'Thêm Người dùng',
    'Delete Faculty': 'Xóa Khoa',
    'Create Faculty': 'Thêm Khoa',
    'Select Faculty': 'Chọn Khoa',
    'Select Academic Year': 'Chọn Niên khóa',
    'Select Class': 'Chọn Lớp',
    'Male': 'Nam',
    'Female': 'Nữ',
    'Other': 'Khác',
    'Full Name': 'Họ và tên',
    'Date of Birth': 'Ngày sinh',
    'Gender': 'Giới tính',
    'Email Address': 'Địa chỉ Email',
    'Phone': 'Số điện thoại',
    'Address': 'Địa chỉ',
    'Credits': 'Số tín chỉ',
    'Tuition/Credit': 'Học phí/Tín chỉ',
    'Prerequisite': 'Tiên quyết',
    'None': 'Không có',
    'No records found': 'Không tìm thấy dữ liệu',
    'Rows Processed': 'Đã xử lý',
    'Errors': 'Lỗi',
    'Uploading...': 'Đang tải lên...',
    'Upload & Import': 'Tải lên & Nhập',
    'Cancel Import': 'Hủy nhập',
    'Edit': 'Sửa',
    'Delete': 'Xóa',
    'Cancel': 'Hủy',
    'Save Changes': 'Lưu thay đổi',
    'Close': 'Đóng',
    'View Details': 'Xem chi tiết',
    'Class / Faculty': 'Lớp / Khoa',
    'Academic Year': 'Niên khóa',
    'Contact Info': 'Thông tin liên hệ',
    'Subject Code': 'Mã học phần',
    'Subject Name': 'Tên môn học',
    'Room Name': 'Tên phòng',
    'Teacher Name': 'Tên giảng viên',
    'Timetable': 'Thời khóa biểu',
    'Type room ID': 'Nhập mã phòng',
    'Type building name': 'Nhập tòa nhà',
    'Capacity': 'Sức chứa',
    'Select status': 'Chọn trạng thái',
    'Active': 'Hoạt động',
    'Inactive': 'Tạm khóa',
    'Select role': 'Chọn vai trò',
    'Change Password': 'Đổi mật khẩu',
    'Sign in to EduPortal AI': 'Đăng nhập EduPortal AI',
    'Welcome back': 'Chào mừng quay trở lại',
    'Sign In': 'Đăng nhập',
    'Forgot Password?': 'Quên mật khẩu?',
    'Remember me': 'Ghi nhớ đăng nhập',
    'Username': 'Tên đăng nhập',
    'Password': 'Mật khẩu',
    'Role': 'Vai trò',
    'Building': 'Tòa nhà',
    'Faculty': 'Khoa',
    'Student Class': 'Lớp hành chính',
    'Semester': 'Học kỳ',
    'Study Time': 'Thời gian học',
    'Shift Name': 'Ca học',
    'Start Date': 'Ngày bắt đầu',
    'End Date': 'Ngày kết thúc',
    'Date of birth': 'Ngày sinh',
    'Email': 'Email',
    'Student ID': 'Mã sinh viên',
    'Teacher ID': 'Mã giảng viên',
    'Room ID': 'Mã phòng',
    'Subject ID': 'Mã môn',
    'Action': 'Thao tác',
    'Download Template': 'Tải file mẫu',
    'Select Excel file': 'Chọn file Excel',
    'Drag & drop': 'Kéo & thả file',
    'Click to browse': 'Click để chọn',
    'Uploading': 'Đang tải lên',
    'Processing': 'Đang xử lý',
    'Completed': 'Hoàn tất',
    'Failed': 'Thất bại',
    'Total students': 'Tổng số SV',
    'Total teachers': 'Tổng số GV',
    'Total subjects': 'Tổng số môn học',
    'Actions': 'Thao tác',
    'Status': 'Trạng thái',
    'Loading...': 'Đang tải...',
    'Error': 'Lỗi',
    'Success': 'Thành công',
    'Are you sure you want to delete this record?': 'Bạn có chắc chắn muốn xóa bản ghi này?',
    'This action cannot be undone.': 'Hành động này không thể hoàn tác.',
    'Yes, Delete': 'Xác nhận xóa',
    'Register': 'Đăng ký',
    'Dashboard': 'Tổng quan',
    'Profile': 'Hồ sơ',
    'Settings': 'Cài đặt',
    'Logout': 'Đăng xuất',
    'Edit Cohort': 'Sửa niên khóa',
    'Register Academic Year Cohort': 'Thêm niên khóa',
    'Delete Academic Year': 'Xóa niên khóa',
    'Edit Room': 'Sửa phòng',
    'Register New Classroom': 'Thêm phòng học',
    'Delete Classroom': 'Xóa phòng học',
    'Open New Credit Class Section': 'Mở lớp tín chỉ mới',
    'New Credit Class': 'Lớp tín chỉ mới',
    'Create Classroom': 'Tạo phòng học',
    'added to credit class!': 'đã được thêm vào lớp tín chỉ!',
    'removed from credit class!': 'đã được xóa khỏi lớp tín chỉ!',
    'Error saving': 'Lỗi khi lưu',
    'Error creating': 'Lỗi khi tạo',
    'Error deleting': 'Lỗi khi xóa',
    'Student Portal': 'Cổng Sinh Viên',
    'Teacher Portal': 'Cổng Giảng Viên',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        content = f.read()
    
    orig = content
    
    # 1. JSX text nodes (e.g. >Cancel<)
    for eng, vn in dict_ui.items():
        # Using a regex that captures > \s* and \s* <
        content = re.sub(r'(>)\s*(' + re.escape(eng) + r')\s*(<)', r'\g<1>' + vn + r'\g<3>', content)

    # 2. String literals in JS (e.g. 'Cancel', "Cancel", `Cancel`)
    for eng, vn in dict_ui.items():
        content = re.sub(r"(?<=['\"`])(" + re.escape(eng) + r")(?=['\"`])", vn, content)
        
    # 3. Specific complex strings (like template literals `Edit: ${id}`)
    for eng, vn in dict_ui.items():
        if eng.endswith(': '):
            content = re.sub(r"(?<=`)(" + re.escape(eng) + r")", vn, content)
            
    # Protect component names - lucide react fix just in case
    # Not needed since we only replace EXACT matches inside quotes/tags
    # We won't accidentally replace <Save> because the tag name is <Save ...> not >Save<

    if orig != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('student-management-frontend/src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))
