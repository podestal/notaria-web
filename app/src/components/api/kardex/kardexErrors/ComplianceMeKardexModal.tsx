import { useState } from "react"
import TopModal from "../../../ui/TopModal"
import useGetComplianceMeKardex from "../../../../hooks/compliance/useGetComplianceMeKardex"
import useAuthStore from "../../../../store/useAuthStore"
import getTitleCase from "../../../../utils/getTitleCase"
import type { ComplianceErrorCounts } from "../../../../services/compliance/complianceService"
import ComplianceKardexModal from "./ComplianceKardexModal"

const MONTH_LABELS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
]

const ErrorCountsHeader = () => (
    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-600">
        <span>SISGEN</span>
        <span>UIF</span>
        <span>PDT</span>
    </div>
)

const ErrorCountsRow = ({ counts }: { counts: ComplianceErrorCounts }) => (
    <div className="grid grid-cols-3 gap-2 text-center text-sm text-slate-700">
        <span>{counts.sisgen}</span>
        <span>{counts.uif}</span>
        <span>{counts.pdt}</span>
    </div>
)

interface Props {
    isOpen: boolean
    onClose: () => void
}

const ComplianceMeKardexModal = ({ isOpen, onClose }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const [kardexId, setKardexId] = useState(0)
    const [kardexCode, setKardexCode] = useState("")
    const [isKardexOpen, setIsKardexOpen] = useState(false)

    const { data, isLoading, isError, error } = useGetComplianceMeKardex({
        access,
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
    }

    const periodLabel =
        data != null
            ? `${MONTH_LABELS[data.month - 1] ?? data.month} ${data.year}`
            : ""

    return (
        <>
            <TopModal isOpen={isOpen} onClose={handleClose} wide>
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                    <header className="border-b border-slate-200 pb-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Mis kardex con errores
                        </p>
                        <h3 className="text-lg font-semibold text-slate-800">
                            {getTitleCase(data?.user?.name || data?.user?.username || "")}
                        </h3>
                        {periodLabel && (
                            <p className="text-xs text-slate-500">Periodo: {periodLabel}</p>
                        )}
                    </header>

                    {isLoading && (
                        <p className="py-8 text-center text-sm text-slate-500 animate-pulse">
                            Cargando tus pendientes...
                        </p>
                    )}

                    {isError && (
                        <p className="py-8 text-center text-sm text-red-600">
                            Error al cargar: {error.message}
                        </p>
                    )}

                    {data && (
                        <>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase text-slate-500">
                                        Con errores
                                    </p>
                                    <p className="text-xl font-bold text-rose-700">
                                        {data.kardex_with_errors}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase text-slate-500">
                                        SISGEN
                                    </p>
                                    <p className="text-xl font-bold text-sky-700">
                                        {data.counts.sisgen}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase text-slate-500">
                                        UIF
                                    </p>
                                    <p className="text-xl font-bold text-indigo-700">
                                        {data.counts.uif}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase text-slate-500">
                                        PDT
                                    </p>
                                    <p className="text-xl font-bold text-violet-700">
                                        {data.counts.pdt}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase text-slate-500">
                                        Total
                                    </p>
                                    <p className="text-xl font-bold text-rose-700">
                                        {data.counts.total}
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <div className="grid min-w-[720px] grid-cols-6 gap-2 bg-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                    <p>Kardex</p>
                                    <p className="col-span-2">Contrato</p>
                                    <p>Fecha ingreso</p>
                                    <ErrorCountsHeader />
                                    <p className="text-center">Total</p>
                                </div>
                                {data.kardex.length === 0 ? (
                                    <p className="px-3 py-6 text-center text-sm text-slate-500">
                                        No hay kardex con errores en este periodo.
                                    </p>
                                ) : (
                                    data.kardex.map((item, index) => (
                                        <div
                                            key={item.idkardex}
                                            className={`grid min-w-[720px] grid-cols-6 gap-2 px-3 py-2 text-sm text-slate-700 ${
                                                index % 2 === 0 ? "bg-white" : "bg-slate-50"
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setKardexId(item.idkardex)
                                                    setKardexCode(item.kardex)
                                                    setIsKardexOpen(true)
                                                }}
                                                className="text-left font-medium text-sky-700 hover:text-sky-900 hover:underline"
                                            >
                                                {item.kardex}
                                            </button>
                                            <p className="col-span-2 truncate" title={item.contrato}>
                                                {item.contrato || "—"}
                                            </p>
                                            <p>{item.fechaingreso || "—"}</p>
                                            <ErrorCountsRow counts={item.counts} />
                                            <p className="text-center font-medium">
                                                {item.counts.total}
                                            </p>
                                        </div>
                                    ))
                                )}
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

export default ComplianceMeKardexModal
