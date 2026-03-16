export const breadcrumbItems = [
    { label: "Trang chủ" },
    { label: "Khóa học của tôi" },
    { label: "Nộp bài tập", active: true },
];

export const courseInfo = {
    title: "Nộp bài tập cá nhân",
    subtitle: "Môn học: Lập trình di động (IT4567) - Nhóm 01",
};

export const assignmentOptions = [
    {
        value: "ex1",
        label: "Bài tập 1: Xây dựng Layout cơ bản",
    },
    {
        value: "ex2",
        label: "Bài tập 2: Xử lý sự kiện và Navigation",
    },
    {
        value: "ex3",
        label: "Bài tập 3: Kết nối API và Hiển thị dữ liệu",
        selected: true,
    },
    {
        value: "final",
        label: "Đồ án cuối kỳ",
    },
];

export const successInfo = {
    title: "Nộp bài thành công!",
    description:
        "Mã xác nhận: #SUB-20231024-981. Bạn đã hoàn thành việc nộp bài lúc 14:30 hôm nay.",
    actionLabel: "Tải phiếu xác nhận (PDF)",
};

export const deadlineInfo = {
    title: "Thời hạn còn lại",
    timeLeft: "02 Ngày, 14 Giờ",
    deadlineText: "Hạn chót: 23:59 - 30/11/2023",
    progress: 67,
};

export const instructions = [
    {
        step: 1,
        text: "Nén tất cả mã nguồn vào một tệp .zip hoặc .rar.",
    },
    {
        step: 2,
        text: "Tên tệp định dạng: MSSV_HoTen_BT3.zip",
    },
    {
        step: 3,
        text: "Đảm bảo link GitHub đã để chế độ Public hoặc thêm giảng viên vào Collaborator.",
    },
    {
        step: 4,
        text: "Hệ thống sẽ tự động đóng sau khi hết hạn, hãy nộp bài đúng giờ.",
    },
];