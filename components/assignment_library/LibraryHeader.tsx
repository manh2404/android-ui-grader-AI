import Link from "next/link";

type LibraryHeaderData = {
    title: string;
    description: string;
};

type Props = {
    data: LibraryHeaderData;
};

export function LibraryHeader({ data }: Props) {
    return (
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900">{data.title}</h2>
                <p className="mt-1 text-slate-500">{data.description}</p>
            </div>

            <Link
                href="/create-assignment"
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
            >
                <span className="material-symbols-outlined">add_circle</span>
                Tạo bài tập mới
            </Link>
        </div>
    );
}