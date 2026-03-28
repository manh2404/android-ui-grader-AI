type LoginHeroData = {
    eyebrow: string;
    title: string;
    description: string;
};

type Props = {
    data: LoginHeroData;
};

export function LoginHero({ data }: Props) {
    return (
        <div className="text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.1em] text-[#a04100]">
                {data.eyebrow}
            </p>

            <h1 className="mb-2 font-headline text-4xl font-extrabold tracking-tight text-[#1a1c1c]">
                {data.title}
            </h1>

            <p className="font-body text-[#5a4136]">{data.description}</p>
        </div>
    );
}