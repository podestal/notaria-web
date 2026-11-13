import { useState } from "react"
import { motion } from "framer-motion"
import { BookText, Filter } from "lucide-react"
import {
    ALFABETICOS_OPTIONS,
    type AlfabeticoTypeId,
} from "./alfabeticosTypes"

const AlfabeticosMain = () => {
    const [docType, setDocType] = useState<AlfabeticoTypeId>("escrituras")
    const active = ALFABETICOS_OPTIONS.find((option) => option.id === docType)
    const ActiveReport = active?.Component

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto mb-10 mt-[80px] w-[92%] max-w-[1400px] text-slate-800"
        >
            <div className="keep-dark relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-slate-50 shadow-lg">
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl"
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 18,
                                delay: 0.1,
                            }}
                            className="rounded-xl border border-indigo-400/30 bg-indigo-500/15 p-2.5"
                        >
                            <BookText className="text-indigo-300" />
                        </motion.div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.16em] text-indigo-300/90">
                                Reportes
                            </p>
                            <h2 className="text-lg font-semibold text-white">
                                Índices Alfabéticos
                            </h2>
                            <p className="text-xs text-slate-400">
                                Consulte índices alfabéticos por tipo de documento
                            </p>
                        </div>
                    </div>
                    <div className="rounded-lg border border-slate-600 bg-slate-800/70 px-3 py-2 text-xs font-semibold text-slate-200">
                        {active?.label ?? "Alfabéticos"}
                    </div>
                </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <Filter className="h-3.5 w-3.5" /> Tipo de documento
                    </p>
                    <div
                        role="radiogroup"
                        aria-label="Tipo de documento alfabético"
                        className="flex flex-wrap gap-2"
                    >
                        {ALFABETICOS_OPTIONS.map((option) => {
                            const isActive = docType === option.id
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={isActive}
                                    onClick={() => setDocType(option.id)}
                                    className={`cursor-pointer rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition ${
                                        isActive ? option.active : option.idle
                                    }`}
                                >
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="min-h-[12rem]">
                    {ActiveReport ? <ActiveReport embedded key={docType} /> : null}
                </div>
            </div>
        </motion.div>
    )
}

export default AlfabeticosMain
