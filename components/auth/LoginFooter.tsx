type FooterLink = {
    label: string;
    href: string;
};

type Props = {
    links: FooterLink[];
};

export function LoginFooter({ links }: Props) {
    return (
        <footer className="border-t border-[#e2bfb0]/10 py-8 text-center">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
                <p className="text-sm text-[#5a4136]">© 2026 AutoGrade. All rights reserved.</p>

                <div className="flex gap-8">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-[#5a4136] transition-colors hover:text-[#a04100]"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}