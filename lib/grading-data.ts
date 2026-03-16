export const assignmentInfo = {
    title: "Bài tập: Cấu trúc Dữ liệu",
    deadline: "Hạn nộp: 23:59 - 20/10/2024",
    totalStudents: 45,
};

export const students = [
    {
        name: "Nguyễn Văn An",
        status: "Đã chấm AI • 15/10",
        score: "8.5",
        active: true,
        avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA_6HX5LU3uiTESVNuS1IygUYKeKVgdA9iVCD7B_7HIvg013JQJ6T4Cldd-myrT0TSGpihtY2uJ-lNwgMUcmTdqX3uPXaZJYFwtc8zDCEOlKZL-qeSXtGB26rdxvhJAGxqRzwA2ssRbwBsol4vqWCTVg5N8ZikClt5X2DZ9f3VvDnAxiBi2j5YTeds4HRtk9R9lP_k-YcME5UZayGy7Eupq_F8s8-ZpFUaijwTHFuQKFBO8VEksRVCPyPhgDBn652PJjWUQFPdTX6A_",
    },
    {
        name: "Lê Thị Bình",
        status: "Đã nộp • Đang chờ",
        score: "--",
        avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDGKlswpMu5CAmkIJNHlFT8jNV1L6Xbj_qeNhAinK3c5Eo7x0mpaDwi6EyEq9ZlCPf5meCVsFkFVvVwms1lPHTLmg-3-XhRXg2XBXAXQCnQgxN7EQN4ym-Otvr9eS4VtJmYYvUis48fYEdYL0E7mqWuphlFjdA5-4YYA0hpgolYfJS0LjG6lQTa8xpMukRhDjreDaIHpL7A2ZQsQzIVxUlWWLohLeJgAYBB1iwq3yxkUcjzSRIM_ywqgFcbsj-Eu3HUcbVXSLUYjEAa",
    },
    {
        name: "Trần Hoàng Nam",
        status: "Đã chấm AI • 14/10",
        score: "7.0",
        avatarUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAjcl4gfS-cSasqe9_8VZ2PLGg7OPP8M4VaC6JlCmzh7YBN-I3_axOde0s1SsR1p71abK26YO7sBi2ezy8QzRA0Ur5O4keNcE8wzn_hdeLzA6P_Ik2jP348j9rMBx9vbNZppxwvJalCSKis_-HV51nsQ5QJJ353ZemC3QLdp_JGrA_lQU6IyE31K80OZv5ETfA-bddOpm1SvZYZ2L8Q5C-iEUgho6CEwtCM_rOOTMXnXVQq40yrL0Arl9N57xD0M0rn5oDxoI13VTnc",
    },
    {
        name: "Phạm Minh Đức",
        status: "Chưa nộp",
        score: "0.0",
        missing: true,
    },
];

export const previewContent = {
    fileName: "bai_tap_tuan_3_an.pdf",
    title: "Cấu trúc dữ liệu Tree và ứng dụng",
    intro:
        "Trong bài làm này, em xin trình bày về cấu trúc dữ liệu cây (Tree), cụ thể là cây nhị phân tìm kiếm (Binary Search Tree - BST). Một cây nhị phân là một cấu trúc dữ liệu phân cấp trong đó mỗi nút có tối đa hai nút con, được gọi là con trái và con phải...",
    code: [
        "class Node {",
        "  int value;",
        "  Node left, right;",
        "  Node(int value) {",
        "    this.value = value;",
        "  }",
        "}",
    ],
    outro:
        "Em đã triển khai các phương thức cơ bản như chèn (insert), xóa (delete) và tìm kiếm (search) trên cây. Hiệu năng của các thao tác này trung bình là O(log n)...",
};

export const scoreSummary = {
    value: "8.5",
    total: "10",
};

export const aiFeedback = {
    strengths: [
        "Trình bày lý thuyết mạch lạc, dễ hiểu.",
        "Mã nguồn Python sạch sẽ, tuân thủ chuẩn PEP8.",
        "Phân tích độ phức tạp thuật toán chính xác cho các trường hợp.",
    ],
    weaknesses: [
        "Thiếu phần xử lý trường hợp ngoại lệ khi cây rỗng.",
        "Chưa đề cập đến tính cân bằng của cây (AVL hoặc Red-Black).",
    ],
    conclusion:
        "Bài làm tốt, sinh viên nắm vững kiến thức cơ bản. Cần bổ sung các trường hợp biên để đạt điểm tối đa.",
};