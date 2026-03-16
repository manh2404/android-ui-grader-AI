type IntroData = {
    title: string;
    description: string;
};

type Props = {
    data: IntroData;
};

export function AssignmentIntro({ data }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{data.title}</h2>
            <p className="text-slate-500">{data.description}</p>
        </div>
    );
}