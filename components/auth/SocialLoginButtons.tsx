type SocialProvider = {
    label: string;
    iconUrl: string;
};

type Props = {
    providers: SocialProvider[];
};

export function SocialLoginButtons({ providers }: Props) {
    return (
        <div className="mt-8 grid grid-cols-2 gap-4">
            {providers.map((provider) => (
                <button
                    key={provider.label}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e2bfb0]/20 bg-[#f3f3f3] px-4 py-3 font-medium text-[#1a1c1c] transition-colors hover:bg-[#e8e8e8]"
                >
                    <img
                        src={provider.iconUrl}
                        alt={provider.label}
                        className="h-5 w-5 object-contain"
                    />
                    <span>{provider.label}</span>
                </button>
            ))}
        </div>
    );
}