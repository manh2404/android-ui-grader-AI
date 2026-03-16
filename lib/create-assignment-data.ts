export const introData = {
    title: "Tạo bài tập mới",
    description: "Thiết lập các thông số và tiêu chí chấm điểm cho sinh viên",
};

export const basicInfoData = {
    assignmentNamePlaceholder: "VD: Lab 01 - Cấu trúc dữ liệu và giải thuật",
    classOptions: [
        { label: "Chọn lớp áp dụng", value: "default" },
        { label: "IT001.N11 - Nhập môn lập trình", value: "it001" },
        { label: "IT002.M22 - Kỹ thuật lập trình", value: "it002" },
    ],
    languageOptions: [
        { label: "C++ (G++ 11)", value: "cpp" },
        { label: "Java 17", value: "java" },
        { label: "Python 3.10", value: "python" },
    ],
    descriptionPlaceholder:
        "Hướng dẫn sinh viên thực hiện bài tập, các yêu cầu kỹ thuật cụ thể...",
};

export const testCasesData = {
    uploadedFiles: [{ name: "Template_Submission.cpp" }],
};

export const deadlineData = {
    allowLateSubmit: false,
};

export const gradingCriteriaData = {
    unitTestPercent: 70,
    enablePlagiarismCheck: true,
    enableLimits: true,
    maxScore: 10,
};

export const helperTip =
    "Bạn có thể sử dụng các biến như {student_id} trong bộ test case để cá nhân hóa việc kiểm tra mã nguồn của sinh viên.";