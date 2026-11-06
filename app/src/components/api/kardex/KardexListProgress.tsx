import type { KardexListTone } from "../../../services/compliance/complianceService"

export type KardexListProgressTone = KardexListTone | "pending"

const LABEL: Record<KardexListProgressTone, string> = {
    pending: "Revisando",
    incomplete: "Incompleto",
    warning: "Avisos",
    complete: "Listo",
}

const LABEL_CLASS: Record<KardexListProgressTone, string> = {
    pending: "text-slate-400",
    incomplete: "text-rose-600",
    warning: "text-amber-700",
    complete: "text-emerald-700",
}

const FILL: Record<Exclude<KardexListProgressTone, "pending">, string> = {
    incomplete: "w-[42%] bg-rose-400",
    warning: "inset-0 bg-amber-400",
    complete: "inset-0 bg-emerald-400",
}

const KardexListProgress = ({ tone }: { tone: KardexListProgressTone }) => (
    <div className="mt-1.5 min-w-0" title={LABEL[tone]}>
        <div className="relative h-[3px]">
            <div className="absolute inset-0 overflow-hidden rounded-full bg-slate-200">
                {tone === "pending" ? (
                    <span className="kardex-list-pending absolute inset-y-0 left-0 w-1/3 rounded-full bg-slate-300" />
                ) : (
                    <span className={`absolute ${FILL[tone]}`} />
                )}
                {tone === "complete" && (
                    <span className="kardex-list-flow absolute inset-y-0 left-0 w-1/3" />
                )}
                {tone === "warning" && (
                    <span className="kardex-list-flow kardex-list-flow-slow absolute inset-y-0 left-0 w-1/3" />
                )}
            </div>
            {tone === "incomplete" && (
                <span className="kardex-list-stop absolute top-1/2 left-[42%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500" />
            )}
        </div>
        {tone !== "pending" && (
            <p className={`mt-1 font-mono text-[9px] font-semibold uppercase tracking-wider ${LABEL_CLASS[tone]}`}>
                {LABEL[tone]}
            </p>
        )}
    </div>
)

export const KardexListProgressStyles = () => (
    <style>{`
        .kardex-list-flow {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent);
            animation: kardex-list-flow 2.4s cubic-bezier(0.45, 0, 0.2, 1) infinite;
        }
        .kardex-list-flow-slow {
            animation-duration: 3.4s;
        }
        .kardex-list-stop {
            box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.45);
            animation: kardex-list-stop 1.8s ease-in-out infinite;
        }
        .kardex-list-pending {
            animation: kardex-list-pending 1.2s ease-in-out infinite;
        }
        @keyframes kardex-list-flow {
            0% { transform: translateX(-120%); opacity: 0; }
            12% { opacity: 1; }
            88% { opacity: 1; }
            100% { transform: translateX(320%); opacity: 0; }
        }
        @keyframes kardex-list-stop {
            0%, 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.45); }
            50% { box-shadow: 0 0 0 4px rgba(244, 63, 94, 0); }
        }
        @keyframes kardex-list-pending {
            0% { transform: translateX(-40%); }
            100% { transform: translateX(220%); }
        }
        @media (prefers-reduced-motion: reduce) {
            .kardex-list-flow, .kardex-list-stop, .kardex-list-pending { animation: none; }
        }
    `}</style>
)

export default KardexListProgress
