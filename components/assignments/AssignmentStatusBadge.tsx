type Props = {
    status: "Đang mở" | "Đã đóng" | "Bản nháp";
};

export function AssignmentStatusBadge({ status }: Props) {
    const className =
        status === "Đang mở"
            ? "bg-green-100 text-green-600"
            : status === "Đã đóng"
                ? "bg-slate-200 text-slate-600"
                : "bg-orange-100 text-orange-500";

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${className}`}
        >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
    </span>
    );
}