export const profile = {
    name: "Nguyễn Văn An",
    email: "an.nguyen_21@university.edu.vn",
    role: "Sinh viên",
    cohort: "Khóa 2021",
    avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB7cJIlNwS6YXr5-r3oy6rXeoUfqQDcE0BdcUzTO_ofmKp8Fwd0hkfElyonYteJuNfpVOtsbXkuOIQVf6cCLCl3BRap9cSihMO4SrHJqma8P84SO5q6mDse2SRqFgb4-MvaRnv8ttOIld9z39T_9s7PzPv2GichCqnPCyuOxSTzahlHBnqZlymd600KNyVYHXdehhF6i-y8FkKhI0yyLxoPk9zziBwW-Jl_xmbzoVYbGeurK7pyL9x_8dNnBfPabUHEpxIc5ZE8rikQ",
};

export const notificationSettings = [
    {
        title: "Email thông báo bài tập",
        description: "Nhận cập nhật khi có bài tập mới",
        icon: "mail",
        enabled: true,
    },
    {
        title: "Thông báo đẩy trên thiết bị",
        description: "Nhắc nhở hạn chót và điểm số",
        icon: "notifications_active",
        enabled: false,
    },
];

export const currentCourses = [
    {
        title: "Lập trình di động (Flutter)",
        schedule: "Thứ 2, 4, 6 (Ca 2)",
        progress: 65,
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDSfOSkfI_jQNAq8TzV2oCT-UVUtd6T5mTEozqpsRTgtoLCwmW-YqRKiRvtNItHv0jhu86Im2lqagqjGrustxQTJ5wvfciyGLLRLJiKXtEA2glSeINzHZkh30yi2jsDX5D5fnc18NS_6TfjaKkc2UD6cOXMxGTy_R8ViF7PEG9gm4sZfDo-oggu2ArZOe4B_0BYnMQ56Z03njOsqZqHSeKW-QCtW5-GWcymBq-sdf3KhvDJJXcnvajIya2tZnRcaG4qXDfspMCb7lkn",
    },
    {
        title: "Thiết kế UI/UX Nâng cao",
        schedule: "Thứ 3, 5 (Ca 1)",
        progress: 40,
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDfMBMwrbrijWbouLkUFpWb03SFchVKIAWM-5OLuNzc4arxXrj-hfG3VAcvS6k1VjdkGrXcGUux5MJrV_qT9U_QV6EWrfFC2N_VvJLkRcJ6e5RKQYa8KXTrLE61igpQqQtKBlKewNBEyK-Lp9tyYxelKQY2pxafZ1qUeLFhHj3y_YQ5SdUxFHpFCMBHpiycf8CCPk2JTNRVcerPv73mIrQNIl-TrRcpKDNzjKQa_aF8wYUJlGhuapGvuGySfLqZSqqp4Hh2lko3KS3x",
    },
];

export const submissionHistory = [
    {
        title: "Bài tập 4: Layout & Navigation",
        submittedAt: "Nộp lúc 14:30 - 15/10/2023",
        status: "Đã chấm",
        score: "9.5/10",
        icon: "task_alt",
        statusColor: "green" as const,
    },
    {
        title: "Đồ án giữa kỳ: App Ecommerce",
        submittedAt: "Nộp lúc 23:55 - 12/10/2023",
        status: "Đang chấm",
        score: "--/--",
        icon: "schedule",
        statusColor: "orange" as const,
    },
    {
        title: "Lab 3: API Integration",
        submittedAt: "Nộp lúc 09:15 - 08/10/2023",
        status: "Đã chấm",
        score: "8.0/10",
        icon: "task_alt",
        statusColor: "green" as const,
    },
];