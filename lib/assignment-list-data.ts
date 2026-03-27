export const assignmentListHeader = {
    title: "Danh sách bài tập",
    description: "Quản lý và theo dõi tiến độ các bài tập đã giao",
};

export const assignmentSearchFilters = {
    statusOptions: [
        { label: "Tất cả trạng thái", value: "all" },
        { label: "Đang mở", value: "open" },
        { label: "Đã đóng", value: "closed" },
        { label: "Bản nháp", value: "draft" },
    ],
    classOptions: [
        { label: "Tất cả lớp học", value: "all" },
        { label: "CS101-Nhóm 02", value: "cs101" },
        { label: "CS202-Nhóm 01", value: "cs202" },
        { label: "IT404-Nhóm 05", value: "it404" },
    ],
};

export const assignmentRows = [
    {
        id: "1",
        title: "Lab 01: Nhập môn Python",
        icon: "description",
        className: "CS101-Nhóm 02",
        assignedDate: "15/10/2023",
        dueDate: "22/10/2023",
        status: "Đang mở" as const,
    },
    {
        id: "2",
        title: "Assignment 02: Binary Search Tree",
        icon: "code",
        className: "CS202-Nhóm 01",
        assignedDate: "01/10/2023",
        dueDate: "10/10/2023",
        status: "Đã đóng" as const,
    },
    {
        id: "3",
        title: "Kiểm tra giữa kỳ 2023",
        icon: "description",
        className: "IT404-Nhóm 05",
        assignedDate: "--/--/----",
        dueDate: "--/--/----",
        status: "Bản nháp" as const,
    },
    {
        id: "4",
        title: "Frontend Project: Portfolio",
        icon: "web",
        className: "IT404-Nhóm 05",
        assignedDate: "20/10/2023",
        dueDate: "30/10/2023",
        status: "Đang mở" as const,
    },
];

export const assignmentPagination = {
    summary: "Hiển thị 1-4 trên tổng số 24 bài tập",
    pages: [1, 2, 3],
    currentPage: 1,
};