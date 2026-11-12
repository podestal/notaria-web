import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Hash, Layers, Link2, Unlink } from "lucide-react"
import type { SisgenInstrumentoStats } from "../../../services/sisgen/searchSisgenService"

interface Props {
    stats: SisgenInstrumentoStats
}

const formatList = (values: number[], max = 8) => {
    if (values.length === 0) return ""
    if (values.length <= max) return values.join(", ")
    return `${values.slice(0, max).join(", ")}… (+${values.length - max})`
}

const StatTile = ({
    label,
    value,
    hint,
    icon,
    tone = "neutral",
}: {
    label: string
    value: string | number
    hint?: string
    icon: ReactNode
    tone?: "neutral" | "ok" | "bad"
}) => {
    const valueClass =
        tone === "ok"
            ? "text-emerald-700"
            : tone === "bad"
              ? "text-rose-700"
              : "text-slate-900"

    const iconWrap =
        tone === "ok"
            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
            : tone === "bad"
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-slate-200 bg-slate-50 text-slate-500"

    return (
        <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 px-3 py-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {label}
                </p>
                <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${iconWrap}`}
                >
                    {icon}
                </span>
            </div>
            <p className={`mt-2 text-2xl font-bold tabular-nums tracking-tight ${valueClass}`}>
                {value}
            </p>
            {hint ? (
                <p className="mt-1 text-[10px] font-medium text-slate-500">{hint}</p>
            ) : null}
        </div>
    )
}

/** Animated correlativo bar: continuous green sweep when OK, broken red when gaps/missing. */
const CorrelativoLine = ({
    ok,
    first,
    last,
    gaps,
    missing,
}: {
    ok: boolean
    first: number | null
    last: number | null
    gaps: number[]
    missing: number
}) => {
    const hasRange = first != null && last != null && last >= first
    const span = hasRange ? last - first + 1 : 0
    const gapSet = new Set(gaps)

    // Build segments along the range: filled = present, hole = gap
    const segments =
        hasRange && span > 0 && span <= 120
            ? Array.from({ length: span }, (_, i) => {
                  const n = first + i
                  return gapSet.has(n) ? "gap" : "ok"
              })
            : null

    return (
        <div className="rounded-xl border border-slate-200/80 bg-white px-3 py-3 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    {ok ? (
                        <Link2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                        <Unlink className="h-3.5 w-3.5 text-rose-600" />
                    )}
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Continuidad de instrumentos
                    </p>
                </div>
                <p
                    className={`text-[11px] font-semibold ${
                        ok ? "text-emerald-700" : "text-rose-700"
                    }`}
                >
                    {ok
                        ? "Secuencia completa"
                        : missing > 0
                          ? `${missing} sin Nº · huecos`
                          : "Hay huecos en la secuencia"}
                </p>
            </div>

            <div className="relative h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
                {ok ? (
                    <>
                        <motion.div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <motion.div
                            aria-hidden
                            className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            initial={{ left: "-35%" }}
                            animate={{ left: "110%" }}
                            transition={{
                                duration: 1.6,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatDelay: 0.8,
                            }}
                        />
                    </>
                ) : segments ? (
                    <div className="absolute inset-0 flex">
                        {segments.map((kind, i) => (
                            <motion.div
                                key={`${first! + i}-${kind}`}
                                className={`h-full flex-1 ${
                                    kind === "gap"
                                        ? "bg-rose-500/90"
                                        : "bg-rose-300/55"
                                } ${i > 0 ? "border-l border-white/40" : ""}`}
                                initial={{ opacity: 0, scaleY: 0.4 }}
                                animate={{ opacity: 1, scaleY: 1 }}
                                transition={{
                                    delay: Math.min(i * 0.012, 0.6),
                                    duration: 0.28,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                )}
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] tabular-nums text-slate-500">
                <span>{first ?? "—"}</span>
                <span className="text-slate-400">→</span>
                <span>{last ?? "—"}</span>
            </div>
        </div>
    )
}

const SisgenInstrumentoStatsCards = ({ stats }: Props) => {
    const ok = stats.correlative_ok
    const first = stats.instrumento_first
    const last = stats.instrumento_last
    const expected = stats.instrumento_expected

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile
                    label="Kardex"
                    value={stats.kardex_count}
                    icon={<Layers className="h-3.5 w-3.5" />}
                />
                <StatTile
                    label="Primer Nº Inst."
                    value={first ?? "—"}
                    icon={<Hash className="h-3.5 w-3.5" />}
                />
                <StatTile
                    label="Último Nº Inst."
                    value={last ?? "—"}
                    icon={<Hash className="h-3.5 w-3.5" />}
                />
                <StatTile
                    label="Correlativo"
                    value={ok ? "OK" : "Huecos"}
                    hint={
                        expected != null
                            ? `rango ${expected} · únicos ${stats.instrumento_unique}`
                            : "sin números"
                    }
                    tone={ok ? "ok" : "bad"}
                    icon={
                        ok ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                            <Unlink className="h-3.5 w-3.5" />
                        )
                    }
                />
            </div>

            <CorrelativoLine
                ok={ok}
                first={first}
                last={last}
                gaps={stats.gaps}
                missing={stats.missing_instrumento}
            />

            {!ok && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-800"
                >
                    <p className="font-semibold">
                        Los Nº de instrumento deben ser correlativos sin huecos.
                    </p>
                    <p className="mt-1">
                        Con {stats.kardex_count} kardex el rango{" "}
                        {first != null && last != null ? `${first}–${last}` : "—"}{" "}
                        debería cubrir exactamente {stats.kardex_count} número(s)
                        {expected != null
                            ? ` (ahora el rango implica ${expected})`
                            : ""}
                        .
                    </p>
                    {stats.gaps.length > 0 && (
                        <p className="mt-1">Faltan: {formatList(stats.gaps)}</p>
                    )}
                    {stats.duplicates.length > 0 && (
                        <p className="mt-1">
                            Duplicados: {formatList(stats.duplicates)}
                        </p>
                    )}
                    {stats.missing_instrumento > 0 && (
                        <p className="mt-1">
                            Sin Nº instrumento: {stats.missing_instrumento} kardex
                        </p>
                    )}
                </motion.div>
            )}
        </div>
    )
}

export default SisgenInstrumentoStatsCards
