import { useState } from "react"
import { motion } from "framer-motion"
import { useQueryClient } from "@tanstack/react-query"
import TopModal from "../../../ui/TopModal"
import useGetComplianceUserKardex from "../../../../hooks/compliance/useGetComplianceUserKardex"
import useAuthStore from "../../../../store/useAuthStore"
import getTitleCase from "../../../../utils/getTitleCase"
import type { ComplianceUser } from "../../../../services/compliance/complianceService"
import ComplianceKardexModal from "./ComplianceKardexModal"
import { invalidateComplianceQueries } from "../../../../hooks/compliance/invalidateComplianceQueries"
import LoadingState from "../../../ui/LoadingState"

const MODAL_GRID = "minmax(110px,1fr) minmax(180px,2fr) 110px 70px 70px 70px 70px"

const ErrorBadge = ({
    value,
    tone,
}: {
    value: number
    tone: "sky" | "indigo" | "amber" | "rose" | "slate"
}) => {
    const tones = {
        sky: "bg-sky-50 text-sky-700 ring-sky-100",
        indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
        amber: "bg-amber-50 text-amber-700 ring-amber-100",
        rose: "bg-rose-50 text-rose-700 ring-rose-100",
        slate: "bg-slate-50 text-slate-700 ring-slate-200",
    }
    return (
        <span className={`inline-flex min-w-[2rem] justify-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ring-1 ${tones[tone]}`}>
            {value}
        </span>
    )
}

interface Props {
    user: ComplianceUser | null
    year: number
    month: number
    onClose: () => void
}

const ComplianceUserKardexModal = ({ user, year, month, onClose }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const queryClient = useQueryClient()
    const isOpen = user != null
    const [kardexId, setKardexId] = useState(0)
    const [kardexCode, setKardexCode] = useState("")
    const [isKardexOpen, setIsKardexOpen] = useState(false)

    const { data, isLoading, isError, error } = useGetComplianceUserKardex({
        access,
        userId: user?.idusuario ?? null,
        year,
        month,
        enabled: isOpen,
    })

    const handleClose = () => {
        setIsKardexOpen(false)
        setKardexId(0)
        setKardexCode("")
        onClose()
    }

    const handleKardexClose = () => {
        setIsKardexOpen(false)
        setKardexId(0)
        setKardexCode("")
        void invalidateComplianceQueries(queryClient)
    }

    const summaryTiles = data
        ? [
            { label: "Kardex", value: data.kardex_count, tone: "text-slate-800" },
            { label: "SISGEN", value: data.counts.sisgen, tone: "text-sky-700" },
            { label: "UIF", value: data.counts.uif, tone: "text-indigo-700" },
            { label: "PDT", value: data.counts.pdt, tone: "text-amber-700" },
            { label: "Total", value: data.counts.total, tone: "text-rose-700" },
          ]
        : []

    return (
        <>
            <TopModal isOpen={isOpen} onClose={handleClose} wide>
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                    <header className="border-b border-slate-200 pb-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Kardex con errores
                        </p>
                        <h3 className="text-lg font-semibold text-slate-800">
                            {getTitleCase(user?.name || user?.username || "")}
                        </h3>
                        {user?.username && user.name && (
                            <p className="text-xs text-slate-500">{user.username}</p>
                        )}
                    </header>

                    {isLoading && (
                        <LoadingState message="Cargando kardex…" description="Errores del usuario" />
                    )}

                    {isError && (
                        <p className="py-8 text-center text-sm text-rose-600">
                            Error al cargar kardex: {error.message}
                        </p>
                    )}

                    {data && (
                        <>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                                {summaryTiles.map((tile, i) => (
                                    <motion.div
                                        key={tile.label}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04, duration: 0.25 }}
                                        className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5"
                                    >
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                            {tile.label}
                                        </p>
                                        <p className={`mt-0.5 text-xl font-bold tabular-nums ${tile.tone}`}>
                                            {tile.value}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <div className="overflow-x-auto">
                                    <div style={{ minWidth: 720 }}>
                                        <div
                                            className="sticky top-0 z-10 grid items-center gap-2 border-b border-slate-200 bg-slate-50/95 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 backdrop-blur"
                                            style={{ gridTemplateColumns: MODAL_GRID }}
                                        >
                                            <p>Kardex</p>
                                            <p>Contrato</p>
                                            <p>Fecha ingreso</p>
                                            <p className="text-center">SISGEN</p>
                                            <p className="text-center">UIF</p>
                                            <p className="text-center">PDT</p>
                                            <p className="text-center">Total</p>
                                        </div>
                                        {data.kardex.length === 0 ? (
                                            <p className="px-3 py-8 text-center text-sm text-slate-500">
                                                No hay kardex con errores para este usuario en el periodo.
                                            </p>
                                        ) : (
                                            <div className="divide-y divide-slate-100">
                                                {data.kardex.map((item, index) => (
                                                    <motion.div
                                                        key={item.idkardex}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{
                                                            duration: 0.25,
                                                            delay: Math.min(index, 12) * 0.03,
                                                        }}
                                                        className="grid items-center gap-2 px-3 py-2.5 text-xs text-slate-700 transition-colors hover:bg-sky-50/70"
                                                        style={{ gridTemplateColumns: MODAL_GRID }}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setKardexId(item.idkardex)
                                                                setKardexCode(item.kardex)
                                                                setIsKardexOpen(true)
                                                            }}
                                                            className="truncate text-left font-semibold text-sky-700 hover:text-sky-900 hover:underline"
                                                        >
                                                            {item.kardex}
                                                        </button>
                                                        <p className="truncate" title={item.contrato}>
                                                            {item.contrato || "—"}
                                                        </p>
                                                        <p className="tabular-nums text-slate-600">
                                                            {item.fechaingreso || "—"}
                                                        </p>
                                                        <div className="flex justify-center">
                                                            <ErrorBadge value={item.counts.sisgen} tone="sky" />
                                                        </div>
                                                        <div className="flex justify-center">
                                                            <ErrorBadge value={item.counts.uif} tone="indigo" />
                                                        </div>
                                                        <div className="flex justify-center">
                                                            <ErrorBadge value={item.counts.pdt} tone="amber" />
                                                        </div>
                                                        <div className="flex justify-center">
                                                            <ErrorBadge value={item.counts.total} tone="rose" />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </TopModal>

            <ComplianceKardexModal
                isOpen={isKardexOpen}
                onClose={handleKardexClose}
                idkardex={kardexId}
                kardex={kardexCode}
            />
        </>
    )
}

export default ComplianceUserKardexModal
