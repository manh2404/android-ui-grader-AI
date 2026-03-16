export function SubmissionTopBar() {
    return (
        <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
                <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                        <span className="material-symbols-outlined">school</span>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold leading-tight text-slate-900">
                            Học tập trực tuyến
                        </h2>
                        <p className="text-xs text-slate-500">Cổng thông tin sinh viên</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500 transition hover:bg-orange-100">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>

                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-orange-100 bg-slate-200">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPDttxCfnL-IIR5FdUs21D5re8zGL3wLTNOLvinqJfuTKEQRg3NwnzCaDaXMIPkaQrtviu9Oz3YWj8ZLngaDOorEV7PMnIaoki7b5ancbIMHpLC6NMCTQhvkAuLKzBGS-hXd3ghzxwZvwWKAxJizpGAVENNUnoT6RC4HognY6yBIb66JUHjohjvyLJCEpPnL2Aeb6QtVzQO6KiyDUN0l9tl2QMcu1AfudjwX9UjJ79Dxmcz1OJvuG2XKZgWKV-K4zxGhZ1KLtWU2Gk"
                            alt="Student Profile"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}