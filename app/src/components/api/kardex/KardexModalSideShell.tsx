import type { ReactNode } from "react"

export type KardexModalSideView = "errors" | "history"

interface Props {
    view: KardexModalSideView
    onViewChange: (view: KardexModalSideView) => void
    errors: ReactNode
    history: ReactNode
    className?: string
}

const TABS: { id: KardexModalSideView; label: string }[] = [
    { id: "errors", label: "Errores" },
    { id: "history", label: "Historial" },
]

/** Shared side rail for report / compliance kardex modals (SISGEN, PDT, UIF). */
const KardexModalSideShell = ({
    view,
    onViewChange,
    errors,
    history,
    className = "",
}: Props) => (
    <div
        className={`flex max-h-[32vh] w-full shrink-0 flex-col lg:max-h-none lg:w-72 ${className}`}
    >
        <div className="mb-2 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onViewChange(tab.id)}
                    className={`cursor-pointer rounded-md px-2 py-1.5 text-[11px] font-semibold transition ${
                        view === tab.id
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 lg:rounded-none lg:border-y-0 lg:border-l-0 lg:border-r">
            {view === "errors" ? errors : history}
        </div>
    </div>
)

export default KardexModalSideShell
