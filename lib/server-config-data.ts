export type SettingsSidebarMatchMode = "exact" | "prefix";

export type SettingsSidebarItem = {
    label: string;
    icon: string;
    href?: string;
    matchMode?: SettingsSidebarMatchMode;
};

export type SettingsSidebarGroup = {
    title: string;
    items: SettingsSidebarItem[];
};

export const pageInfo = {
    title: "Cấu hình Server Chấm bài",
    description:
        "Thiết lập các thông số kỹ thuật cho các node chấm bài tự động và kết nối API.",
};

export const sidebarGroups: SettingsSidebarGroup[] = [
    {
        title: "Hệ thống",
        items: [
            {
                label: "Quản lý người dùng",
                icon: "group",
                href: "/ui/server_config/users",
                matchMode: "prefix",
            },
            {
                label: "Server Chấm bài",
                icon: "database",
                href: "/ui/server_config",
                matchMode: "exact",
            },
            {
                label: "Giới hạn tài nguyên",
                icon: "speed",
            },
            {
                label: "Email thông báo",
                icon: "mail",
            },
            {
                label: "Sao lưu dữ liệu",
                icon: "cloud_upload",
            },
        ],
    },
    {
        title: "Bảo mật & Log",
        items: [
            {
                label: "Nhật ký hệ thống",
                icon: "history",
            },
            {
                label: "Phân quyền Admin",
                icon: "security",
            },
        ],
    },
];

export const versionInfo = {
    version: "v2.1.0-Stable",
    updatedAt: "Đã cập nhật: 12 phút trước",
};

export const apiConnectionData = {
    title: "Thông tin kết nối API",
    serverUrl: "https://judge.autograde.io/v1/api",
    apiKey: "sk_test_51MzZ2K...",
};

export const defaultLimitsData = {
    title: "Thiết lập giới hạn mặc định",
    maxRuntimeMs: 1000,
    maxMemoryMb: 256,
};

export const emailSettingsData = {
    title: "Email thông báo",
    enabled: true,
    smtpServer: "smtp.gmail.com",
    senderEmail: "noreply@autograde.io",
};

export const backupSettingsData = {
    title: "Sao lưu dữ liệu",
    backupFrequency: "Hàng ngày (00:00)",
    cloudProvider: "Google Drive",
    reconnectLabel: "Kết nối lại",
};
