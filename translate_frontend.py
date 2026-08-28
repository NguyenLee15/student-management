import os, re

dict_ui = {
    'Edit': 'Sửa',
    'Delete': 'Xóa',
    'Cancel': 'Hủy',
    'Save Changes': 'Lưu thay đổi',
    'Save': 'Lưu',
    'Create ': 'Tạo ',
    'Create': 'Tạo',
    'Update': 'Cập nhật',
    'Add': 'Thêm',
    'New': 'Mới',
    'Close': 'Đóng',
    'Confirm': 'Xác nhận',
    'Search...': 'Tìm kiếm...',
    'Search': 'Tìm kiếm',
    'Actions': 'Thao tác',
    'Action': 'Thao tác',
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
    
    # Specifics found in code
    'Edit Cohort': 'Sửa niên khóa',
    'Register Academic Year Cohort': 'Thêm niên khóa',
    'Delete Academic Year': 'Xóa niên khóa',
    'Edit Room': 'Sửa phòng',
    'Register New Classroom': 'Thêm phòng học',
    'Delete Classroom': 'Xóa phòng học',
    'Open New Credit Class Section': 'Mở lớp tín chỉ mới',
    'Credit Classes & Course Enrolment': 'Lớp Tín Chỉ & Đăng Ký',
    'New Credit Class': 'Lớp tín chỉ mới',
    'Create Classroom': 'Tạo phòng học',
    'created successfully!': 'đã được tạo thành công!',
    'updated!': 'đã được cập nhật!',
    'deleted!': 'đã được xóa!',
    'added to credit class!': 'đã được thêm vào lớp tín chỉ!',
    'removed from credit class!': 'đã được xóa khỏi lớp tín chỉ!',
    'Error saving': 'Lỗi khi lưu',
    'Error creating': 'Lỗi khi tạo',
    'Error deleting': 'Lỗi khi xóa',
    
    # Placeholders
    'Type room ID (e.g. A101)': 'Nhập mã phòng (VD: A101)',
    'Room Name': 'Tên phòng',
    'Capacity': 'Sức chứa',
    'Building': 'Tòa nhà',
    'Subject': 'Môn học',
    'Teacher': 'Giảng viên',
    'Semester': 'Học kỳ',
    
    'Student Portal': 'Cổng Sinh Viên',
    'Teacher Portal': 'Cổng Giảng Viên',
}

def translate_match(m):
    original = m.group(1)
    if original in dict_ui:
        return m.group(0).replace(original, dict_ui[original])
    return m.group(0)

# We want to replace text in single quotes, double quotes, or inside JSX tags (>Text<)
# This requires a few passes

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        content = f.read()
    
    orig = content
    
    # Replace keys directly for simplicity and safety, but only if they are isolated 
    # (to prevent replacing 'Create' inside 'CreatedAt')
    for eng, vn in dict_ui.items():
        # Replace in JSX text nodes
        content = re.sub(r'>\s*' + re.escape(eng) + r'\s*<', f'>{vn}<', content)
        # Replace in string literals (e.g. 'Edit', "Edit")
        content = re.sub(r"(?<=['\"])(" + re.escape(eng) + r")(?=['\"])", vn, content)
        # Replace template literals (e.g. Edit Room: )
        content = re.sub(r"(?<=)(" + re.escape(eng) + r")(?=.*?\$\{)", vn, content)
    
    if orig != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('student-management-frontend/src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))
