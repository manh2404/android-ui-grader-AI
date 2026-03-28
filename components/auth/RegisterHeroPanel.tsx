type RegisterHeroData = {
    eyebrow: string;
    brand: string;
    description: string;
    imageUrl: string;
};

type Props = {
    data: RegisterHeroData;
};

export function RegisterHeroPanel({ data }: Props) {
    return (
        <section className="flex flex-col space-y-8 pr-12">
            <div className="space-y-2">
        <span className="font-label text-sm font-bold uppercase tracking-[0.2em] text-[#a04100]">
          {data.eyebrow}
        </span>

                <h1 className="font-headline text-5xl font-extrabold leading-none tracking-tighter text-[#1a1c1c]">
                    {data.brand} <span className="text-[#a04100]">.</span>
                </h1>
            </div>

            <p className="max-w-md text-lg leading-relaxed text-[#5a4136]">
                {data.description}
            </p>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl">
                <img
                    src={data.imageUrl}
                    alt="Academic workspace"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[#4c56af]/10" />
            </div>
        </section>
    );
}