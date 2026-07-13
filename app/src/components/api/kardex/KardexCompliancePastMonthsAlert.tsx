import { AlertTriangle } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import ComplianceMeKardexModal from "./kardexErrors/ComplianceMeKardexModal"
import { useCompliancePastMonthsUrgent } from "./useCompliancePastMonthsUrgent"

interface Props {
    /** Compact sticky banner for modal chrome (outside scroll). */
    sticky?: boolean
}

/** Shown when the user has overdue past-month compliance errors. */
const KardexCompliancePastMonthsAlert = ({ sticky = false }: Props) => {
    const [modalOpen, setModalOpen] = useState(false)
    const { show, monthsLabel, errorTotal } = useCompliancePastMonthsUrgent()

    if (!show) return null

    return (
        <>
            <div
                className={`flex items-start gap-3 border-rose-300 bg-rose-50 text-rose-950 ${
                    sticky
                        ? "shrink-0 border-b px-3 py-2.5 sm:px-4"
                        : "border-b px-4 py-3 sm:px-5"
                }`}
            >
                <AlertTriangle
                    className="mt-0.5 h-5 w-5 shrink-0 text-rose-600"
                    aria-hidden
                />
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                        Tienes errores de cumplimiento en meses anteriores
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-rose-800">
                        Pendientes en <span className="font-semibold">{monthsLabel}</span>
                        {" · "}
                        {errorTotal} error{errorTotal === 1 ? "" : "es"}. Corrige esos
                        kardex para limpiar tu historial.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-rose-700"
                        >
                            Ver mis kardex
                        </button>
                        <Link
                            to="/app/panel-general"
                            className="rounded-md border border-rose-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-rose-800 transition hover:bg-rose-100"
                        >
                            Panel general
                        </Link>
                    </div>
                </div>
            </div>

            <ComplianceMeKardexModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    )
}

export default KardexCompliancePastMonthsAlert
