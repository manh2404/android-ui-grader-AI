type Props = {
    text: string;
};

export function HelperTipCard({ text }: Props) {
    return (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex gap-3">
        <span className="material-symbols-outlined text-orange-500">
          lightbulb
        </span>

                <p className="text-xs leading-relaxed text-orange-500">
                    <strong>Mẹo:</strong> {text}
                </p>
            </div>
        </div>
    );
}