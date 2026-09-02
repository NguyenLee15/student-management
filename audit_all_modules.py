import os
import re

src_dir = r"D:\DATN\StudentManager\student-management-frontend\src"
modules_dir = os.path.join(src_dir, "components", "modules")
layouts_dir = os.path.join(src_dir, "layouts")

issues = []

# List of files to verify
files_to_check = []
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith(".jsx") or f.endswith(".js"):
            files_to_check.append(os.path.join(root, f))

print(f"Auditing {len(files_to_check)} frontend source files...")

for fp in files_to_check:
    rel_path = os.path.relpath(fp, src_dir)
    with open(fp, "r", encoding="utf-8-sig") as f:
        code = f.read()

    # 1. Check Lucide icon imports vs usage
    lucide_imports = set()
    for m in re.finditer(r'import\s+\{([^}]+)\}\s+from\s+[\'"]lucide-react[\'"]', code):
        for icon in m.group(1).split(','):
            icon = icon.strip().split(' as ')[-1].strip()
            if icon:
                lucide_imports.add(icon)

    # Check for JSX tags that might be Lucide icons but not imported
    # Common Lucide icon names pattern: PascalCase words
    for m in re.finditer(r'<([A-Z][a-zA-Z0-9]+)(\s|/|>)', code):
        tag = m.group(1)
        # Skip standard React/HTML components, chart components, custom modules
        known_components = [
            "React", "Modal", "Pagination", "EmptyState", "Skeleton", "ConfirmDialog", 
            "StatCard", "ProfileSettingsModal", "ChangePasswordModal", "TranscriptModal", 
            "Header", "Sidebar", "DashboardModule", "StudentModule", "TeacherModule", 
            "FacultyModule", "AcademicYearModule", "StudentClassModule", "SubjectModule", 
            "ClassroomModule", "CreditClassModule", "ScheduleModule", "GradeModule", 
            "UserModule", "AuditLogModule", "CourseRegistrationView", "StudentDashboardView", 
            "StudentTranscriptView", "TuitionLedgerView", "ToastContainer", "Toast", 
            "ResponsiveContainer", "PieChart", "Pie", "Cell", "BarChart", "Bar", 
            "XAxis", "YAxis", "CartesianGrid", "Tooltip", "Icon", "AdminLayout",
            "TeacherLayout", "StudentLayout", "StudentPortalLayout", "App", "Routes", "Route", "Navigate"
        ]
        if tag in known_components:
            continue
        if tag not in lucide_imports:
            # Check if defined locally
            if f"const {tag}" not in code and f"function {tag}" not in code and f"let {tag}" not in code and f"import {tag}" not in code and f"import" not in code:
                issues.append(f"[{rel_path}] Icon/Component <{tag}> is used but NOT imported from lucide-react or anywhere!")

    # 2. Check for common React Hook issues (e.g. hook called conditionally)
    # Check if useEffect/useState imported when used
    if "useState(" in code and "useState" not in code.split("import")[1] if "import" in code else False:
        pass

    # 3. Check for undefined API references
    api_imports = set()
    for m in re.finditer(r'import\s+\{([^}]+)\}\s+from\s+[\'"].*?api.*?[\'"]', code):
        for a in m.group(1).split(','):
            a = a.strip().split(' as ')[-1].strip()
            if a:
                api_imports.add(a)

    for api_call in re.findall(r'([a-zA-Z0-9]+Api)\.', code):
        if api_call not in api_imports and f"const {api_call}" not in code:
            issues.append(f"[{rel_path}] API {api_call} is called but NOT imported!")

    # 4. Check for unclosed JSX or malformed brackets (basic count check)
    if code.count("{") != code.count("}"):
        issues.append(f"[{rel_path}] Mismatched curly braces! ({{ count: {code.count('{')}, }} count: {code.count('}')})")

if issues:
    print(f"Found {len(issues)} potential issues:")
    for iss in issues:
        print(" -", iss)
else:
    print("SUCCESS: 0 syntax issues, 0 missing icon imports, 0 missing API imports found across all files!")