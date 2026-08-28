import os, re

dict_ui = {
    'Class / Faculty': 'Lớp / Khoa',
    'Academic Year': 'Niên khóa',
    'Contact Info': 'Thông tin liên hệ',
    'Subject Code': 'Mã học phần',
    'Subject Name': 'Tên môn học',
    'Room Name': 'Tên phòng',
    'Teacher Name': 'Tên giảng viên',
    'Timetable': 'Thời khóa biểu',
    'Credits': 'Số tín chỉ',
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
    'Phone': 'Số điện thoại',
    'Address': 'Địa chỉ',
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