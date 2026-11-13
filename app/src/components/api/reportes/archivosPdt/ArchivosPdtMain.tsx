import { useCallback, useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FileSpreadsheet, Filter, ShieldCheck } from "lucide-react"
import ArchivosPdtHeader from "./ArchivosPdtHeader"
import ArchivosPdtPanel from "./ArchivosPdtPanel"
import { PDT_TYPE_OPTIONS, type PdtTypeId } from "./archivosPdtTypes"
import useUserInfoStore from "../../../../hooks/store/useGetUserInfo"
import { userIsStaffOrSuperuser } from "../../../../utils/userIsStaffOrSuperuser"

const ArchivosPdtMain = () => {
    const user = useUserInfoStore((s) => s.user)
    const [pdtType, setPdtType] = useState<PdtTypeId>("escrituras")
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const refetchRef = useRef<() => Promise<unknown>>(async () => undefined)

    const onRefetchReady = useCallback((refetch: () => Promise<unknown>) => {
        refetchRef.current = refetch
    }, [])

    const activeOption = PDT_TYPE_OPTIONS.find((option) => option.id === pdtType)

    if (!userIsStaffOrSuperuser(user)) {
        return <Navigate to="/app/protocolares" replace />
    }

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
                    className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl"
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                            className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 p-2.5"
                        >
                            <FileSpreadsheet className="text-emerald-300" />
                        </motion.div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-300/90">
                                Módulo
                            </p>
                            <h2 className="text-lg font-semibold text-white">Archivos PDT</h2>
                            <p className="text-xs text-slate-400">
                                Generación de archivos PDT por tipo de instrumento
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/70 px-3 py-2 text-slate-200">
                        <ShieldCheck size={16} className="text-emerald-300" />
                        <p className="text-xs font-semibold">
                            {activeOption?.label ?? "PDT"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5 space-y-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <Filter className="h-3.5 w-3.5" /> Tipo de archivo
                    </p>
                    <div
                        role="radiogroup"
                        aria-label="Tipo de archivo PDT"
                        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
                    >
                        {PDT_TYPE_OPTIONS.map((option, i) => {
                            const isActive = pdtType === option.id
                            const Icon = option.icon
                            return (
                                <motion.button
                                    key={option.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={isActive}
                                    onClick={() => setPdtType(option.id)}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: i * 0.04 }}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`relative flex cursor-pointer flex-col items-start gap-2 rounded-xl border bg-white p-3 text-left transition-shadow ${
                                        isActive
                                            ? `${option.tone.active} shadow-md ring-4`
                                            : "border-slate-200 shadow-sm hover:shadow-md"
                                    }`}
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <span className={`rounded-lg p-1.5 ${option.tone.icon}`}>
                                            <Icon className="h-4 w-4" />
                                        </span>
                                        {isActive && (
                                            <motion.span
                                                layoutId="archivos-pdt-type-dot"
                                                className={`h-2 w-2 rounded-full ${option.tone.dot}`}
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-800">
                                            {option.label}
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                            {option.description}
                                        </p>
                                    </div>
                                </motion.button>
                            )
                        })}
                    </div>
                </div>

                <ArchivosPdtHeader
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    dateTo={dateTo}
                    setDateTo={setDateTo}
                    loading={loading}
                    setLoading={setLoading}
                    refetch={() => refetchRef.current()}
                />

                <div className="min-h-[12rem]">
                    <ArchivosPdtPanel
                        pdtType={pdtType}
                        dateFrom={dateFrom}
                        dateTo={dateTo}
                        page={page}
                        setPage={setPage}
                        onRefetchReady={onRefetchReady}
                    />
                </div>
            </div>
        </motion.div>
    )
}

export default ArchivosPdtMain
