"use client";

import { useEffect, useRef, useState } from "react";

type SemesterOption = {
    value: string;
    label: string;
};

type SemesterFiltersProps = {
    value: string;
    onChange: (value: string) => void;
};

const semesterOptions: SemesterOption[] = [
    { value: "all", label: "Tất cả" },
    { value: "HK1", label: "Học kỳ 1" },
    { value: "HK2", label: "Học kỳ 2" },
    { value: "HK3", label: "Học kỳ 3" },
];

export function SemesterFilters({
                                    value,
                                    onChange,
                                }: SemesterFiltersProps) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const selected =
        semesterOptions.find((item) => item.value === value) || semesterOptions[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (newValue: string) => {
        onChange(newValue);
        setOpen(false);
    };

    return (
        <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="mr-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                HỌC KỲ:
            </span>

            <div className="relative" ref={wrapperRef}>
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex min-w-[180px] items-center justify-between rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
                >
                    <span>{selected.label}</span>
                    <span>{open ? "▲" : "▼"}</span>
                </button>

                {open ? (
                    <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                        {semesterOptions.map((item) => {
                            const isActive = item.value === value;

                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => handleSelect(item.value)}
                                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${
                                        isActive
                                            ? "bg-orange-50 font-semibold text-orange-500"
                                            : "text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    <span>{item.label}</span>
                                    {isActive ? <span>✓</span> : null}
                                </button>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
}