import { Classroom } from "@/app/ui/my_classes/type/classroom.type";

type ClassCardProps = {
    classroom: Classroom;
    onDelete: (id: string) => void;
    onViewDetail: (classroom: Classroom) => void;
    onEdit: (classroom: Classroom) => void;
};

export function ClassCard({
                              classroom,
                              onDelete,
                              onViewDetail,
                              onEdit,
                          }: ClassCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        {classroom.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Mã lớp: {classroom.code}
                    </p>
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                    {classroom.semester || "HK1"}
                </span>
            </div>

            <p className="mt-3 text-sm text-slate-600">
                {classroom.description || "Chưa có mô tả"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {classroom.academicYear || "2025-2026"}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {classroom.status || "active"}
                </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => onViewDetail(classroom)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    Xem chi tiết
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(classroom)}
                    className="rounded-xl bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                >
                    Sửa
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(classroom._id)}
                    className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                >
                    Xóa
                </button>
            </div>
        </div>
    );
}