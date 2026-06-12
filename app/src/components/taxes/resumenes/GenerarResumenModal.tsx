import { useEffect, useState } from "react"
import { FileStack } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useGetRecibosPendientesSunat from "../../../hooks/taxes/recibos/useGetRecibosPendientesSunat"
import TopModal from "../../ui/TopModal"
import ComprobanteCard from "../comprobantes/ComprobanteCard"
import {
    getDefaultIngresoFechaEmision,
    isValidIngresoFechaEmision,
} from "../controlInterno/ingresoFormShared"
import { formatLocalDate } from "../../../utils/formatLocalDate"

interface Props {
    isOpen: boolean
    onClose: () => void
}

const GenerarResumenModal = ({ isOpen, onClose }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const [fechaEmision, setFechaEmision] = useState(getDefaultIngresoFechaEmision())
    const [fechaError, setFechaError] = useState("")

    useEffect(() => {
        if (isOpen) {
            setFechaEmision(getDefaultIngresoFechaEmision())
            setFechaError("")
        }
    }, [isOpen])

    const fechaValida = isValidIngresoFechaEmision(fechaEmision)
    const { data: pendientes = [], isLoading, isError, error, isFetching } =
        useGetRecibosPendientesSunat({
            access,
            fecha_emision: fechaEmision,
            enabled: isOpen && fechaValida,
        })

    const handleFechaChange = (value: string) => {
        setFechaEmision(value)
        if (fechaError && isValidIngresoFechaEmision(value)) {
            setFechaError("")
        }
    }

    return (
        <TopModal isOpen={isOpen} onClose={onClose} wide portal deepth={60}>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <header className="mb-4 shrink-0 border-b border-slate-100 pb-3">
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2">
                            <FileStack className="h-5 w-5 text-sky-600" aria-hidden />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800">
                                Generar resumen
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Comprobantes pendientes de envío a SUNAT para la fecha de
                                emisión seleccionada.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="mb-4 shrink-0">
                    <div className="grid w-full max-w-md grid-cols-3 items-center gap-4">
                        <label
                            htmlFor="generar-resumen-fecha"
                            className="pl-2 text-xs font-semibold text-slate-700"
                        >
                            Fecha emisión
                        </label>
                        <div className="col-span-2 flex items-center gap-2">
                            <input
                                id="generar-resumen-fecha"
                                type="date"
                                value={fechaEmision}
                                onChange={(e) => handleFechaChange(e.target.value)}
                                onBlur={() => {
                                    if (!isValidIngresoFechaEmision(fechaEmision)) {
                                        setFechaError("Ingrese una fecha de emisión válida")
                                    }
                                }}
                                className="min-w-40 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            />
                            <span className="text-red-500">*</span>
                        </div>
                        {fechaError && (
                            <p className="col-span-3 px-2 text-xs text-red-500">
                                {fechaError}
                            </p>
                        )}
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    {fechaValida && pendientes.length > 0 && (
                        <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800">
                            <span>
                                {pendientes.length} comprobante
                                {pendientes.length === 1 ? "" : "s"} pendiente
                                {pendientes.length === 1 ? "" : "s"} —{" "}
                                {formatLocalDate(fechaEmision)}
                            </span>
                            {isFetching && !isLoading && (
                                <span className="font-normal text-slate-500">
                                    Actualizando…
                                </span>
                            )}
                        </div>
                    )}

                    {isLoading && (
                        <p className="py-10 text-center text-sm text-slate-500 animate-pulse">
                            Cargando comprobantes pendientes…
                        </p>
                    )}

                    {isError && (
                        <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                            {error instanceof Error
                                ? error.message
                                : "No se pudieron cargar los comprobantes pendientes."}
                        </p>
                    )}

                    {!isLoading && !isError && fechaValida && pendientes.length === 0 && (
                        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-10 text-center text-sm text-slate-500">
                            No hay comprobantes pendientes de SUNAT para{" "}
                            {formatLocalDate(fechaEmision)}.
                        </p>
                    )}

                    {!isLoading && pendientes.length > 0 && (
                        <ul className="space-y-3">
                            {pendientes.map((item) => (
                                <li key={item.id_recibo}>
                                    <ComprobanteCard variant="recibo" item={item} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-4 flex shrink-0 justify-end border-t border-slate-100 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </TopModal>
    )
}

export default GenerarResumenModal
