import Link from "next/link";

type AssignmentsHeaderData = {
  title: string;
  description: string;
};

type Props = {
  data: AssignmentsHeaderData;
};

export function AssignmentsHeader({ data }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          {data.title}
        </h1>
        <p className="mt-2 text-base text-slate-500">{data.description}</p>
      </div>

      <Link
        href="/ui/create_assignment"
        className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-600"
      >
        <span className="material-symbols-outlined">add</span>
        Tạo bài tập mới
      </Link>
    </div>
  );
}