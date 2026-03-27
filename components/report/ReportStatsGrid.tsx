import { ReportStatCard } from "./ReportStatCard";

type ReportStatItem = {
    title: string;
    value: string;
    subValue: string;
    subValueColor: string;
    subtitle: string;
    icon: string;
    iconClassName: string;
};

type Props = {
    items: ReportStatItem[];
};

export function ReportStatsGrid({ items }: Props) {
    return (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
                <ReportStatCard key={item.title} item={item} />
            ))}
        </div>
    );
}