type LoginTopBarData = {
    brand: string;
    helpLabel: string;
};

type Props = {
    data: LoginTopBarData;
};

export function LoginTopBar({ data }: Props) {
    return (
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
            <div className="font-headline text-2xl font-black tracking-tighter text-[#a04100]">
                {data.brand}
            </div>

            <button className="rounded-lg px-4 py-2 font-headline font-bold text-[#4c56af] transition-colors hover:bg-[#eeeeee]">
                {data.helpLabel}
            </button>
        </header>
    );
}