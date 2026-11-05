import type { KardexListTone } from "../../../services/compliance/complianceService"

export type KardexListProgressTone = KardexListTone | "pending"

const LABEL: Record<KardexListProgressTone, string> = {
    pending: "Revisando avance",
    incomplete: "Incompleto",
    warning: "Con avisos",
    complete: "Completo",
}

const KardexListProgress = ({ tone }: { tone: KardexListProgressTone }) => {
    if (tone === "pending") return null

    return (
        <div
            className="pointer-events-none absolute inset-x-4 bottom-0 h-px"
            title={LABEL[tone]}
        >
            <span className="sr-only">{LABEL[tone]}</span>
            {tone === "incomplete" && <span className="kardex-list-hold absolute inset-0 bg-rose-400" />}
            {tone === "warning" && (
                <span className="absolute inset-0 overflow-hidden bg-amber-300/80">
                    <span className="kardex-list-flow kardex-list-flow-slow absolute inset-y-0 left-0 w-2/5" />
                </span>
            )}
            {tone === "complete" && (
                <span className="absolute inset-0 overflow-hidden bg-emerald-400/80">
                    <span className="kardex-list-flow absolute inset-y-0 left-0 w-1/3" />
                    <span className="kardex-list-flow kardex-list-flow-late absolute inset-y-0 left-0 w-1/4" />
                </span>
            )}
        </div>
    )
}

export const KardexListProgressStyles = () => (
    <style>{`
        .kardex-list-flow {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.92), transparent);
            animation: kardex-list-flow 1.35s linear infinite;
        }
        .kardex-list-flow-slow {
            animation-duration: 2.8s;
            animation-timing-function: ease-in-out;
        }
        .kardex-list-flow-late {
            animation-delay: 0.5s;
            animation-fill-mode: backwards;
        }
        .kardex-list-hold {
            animation: kardex-list-hold 1.8s ease-in-out infinite;
        }
        @keyframes kardex-list-flow {
            0% { transform: translateX(-130%); }
            100% { transform: translateX(430%); }
        }
        @keyframes kardex-list-hold {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 0.9; }
        }
        @media (prefers-reduced-motion: reduce) {
            .kardex-list-flow, .kardex-list-hold { animation: none; opacity: 1; }
        }
    `}</style>
)

export default KardexListProgress
