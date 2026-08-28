import os, re

dict_ui = {
    'Student Directory': 'Quản lý Sinh viên',
    'Import Excel': 'Nhập Excel',
    'Export Excel': 'Xuất Excel',
    'New Student': 'Thêm Sinh viên',
    'Student ': 'Sinh viên ',
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

    # Common
    'Edit': 'Sửa',
    'Delete': 'Xóa',
    'Cancel': 'Hủy',
    'Save Changes': 'Lưu thay đổi',
    'Close': 'Đóng',
    'View Details': 'Xem chi tiết',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        content = f.read()
    
    orig = content
    
    for eng, vn in dict_ui.items():
        # strict replacement in strings or JSX tags
        content = re.sub(r"(?<=['\"])(" + re.escape(eng) + r")(?=['\"])", vn, content)
        content = re.sub(r"(?<=)(" + re.escape(eng) + r")", vn, content)
        content = re.sub(r'>\s*' + re.escape(eng) + r'\s*<', f'>{vn}<', content)

    if orig != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('student-management-frontend/src'):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))