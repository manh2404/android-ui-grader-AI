import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
    subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
    title: "AutoGrading AI",
    description: "Dashboard hệ thống chấm bài tự động",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
        <head>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
            />
        </head>
        <body className={`${publicSans.className} bg-[#f6f7fb] text-slate-900 antialiased`}>
        {children}
        </body>
        </html>
    );
}