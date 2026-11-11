import { AnimatePresence, motion } from "framer-motion"
import { Check } from "lucide-react"
import type { KardexListTone } from "../../../services/compliance/complianceService"

export type KardexListProgressTone = KardexListTone | "pending"

const LABEL: Record<KardexListProgressTone, string> = {
    pending: "Revisando",
    incomplete: "Incompleto",
    warning: "Avisos",
    complete: "Completado",
}

const LABEL_CLASS: Record<KardexListProgressTone, string> = {
    pending: "text-slate-400",
    incomplete: "text-rose-600",
    warning: "text-amber-700",
    complete: "text-emerald-700",
}

const FILL_CLASS: Record<Exclude<KardexListProgressTone, "pending">, string> = {
    incomplete: "bg-rose-400",
    warning: "bg-amber-400",
    complete: "bg-emerald-500",
}

const FILL_WIDTH: Record<Exclude<KardexListProgressTone, "pending">, string> = {
    incomplete: "42%",
    warning: "100%",
    complete: "100%",
}

const KardexListProgress = ({ tone }: { tone: KardexListProgressTone }) => (
    <div className="mt-1.5 min-w-0" title={LABEL[tone]}>
        <div className="relative h-[3px]">
            <div className="absolute inset-0 overflow-hidden rounded-full bg-slate-200">
                <AnimatePresence mode="wait" initial={false}>
                    {tone === "pending" ? (
                        <motion.span
                            key="pending"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="kardex-list-pending absolute inset-y-0 left-0 w-1/3 rounded-full bg-sky-300"
                        />
                    ) : (
                        <motion.span
                            key={`fill-${tone}`}
                            className={`absolute inset-y-0 left-0 rounded-full ${FILL_CLASS[tone]}`}
                            initial={{ width: 0, opacity: 0.4 }}
                            animate={{ width: FILL_WIDTH[tone], opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        />
                    )}
                </AnimatePresence>
                {(tone === "complete" || tone === "warning") && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className={`kardex-list-flow absolute inset-y-0 left-0 w-1/3 ${
                            tone === "warning" ? "kardex-list-flow-slow" : ""
                        }`}
                    />
                )}
            </div>
            <AnimatePresence>
                {tone === "incomplete" && (
                    <motion.span
                        key="stop"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.28 }}
                        className="kardex-list-stop absolute top-1/2 left-[42%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500"
                    />
                )}
            </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
            {tone !== "pending" && (
                <motion.p
                    key={tone}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.28, delay: 0.18, ease: "easeOut" }}
                    className={`mt-1 inline-flex items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-wider ${LABEL_CLASS[tone]}`}
                >
                    {tone === "complete" && (
                        <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <Check className="h-2 w-2" strokeWidth={3} aria-hidden />
                        </span>
                    )}
                    {LABEL[tone]}
                </motion.p>
            )}
        </AnimatePresence>
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
