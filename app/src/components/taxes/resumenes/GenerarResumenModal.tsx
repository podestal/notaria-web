import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { FileStack } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useCreateResumen from "../../../hooks/taxes/resumenes/useCreateResumen"
import useGetResumenRecibosPendientes from "../../../hooks/taxes/resumenes/useGetResumenRecibosPendientes"
import { RECIBO_COMPROBANTE_BOLETA } from "../../../services/taxes/recibosService"
import type { Recibo } from "../../../services/taxes/recibosService"
import getTitleCase from "../../../utils/getTitleCase"
import { formatLocalDate } from "../../../utils/formatLocalDate"
import TopModal from "../../ui/TopModal"
import {
    getDefaultIngresoFechaEmision,
    getIngresoBackendError,
    isValidIngresoFechaEmision,
} from "../controlInterno/ingresoFormShared"

interface Props {
    isOpen: boolean
    onClose: () => void
    onCreated?: () => void
}

const formatAmount = (value: string, moneda: string) => {
    const n = Number(value)
    const prefix = moneda === "SOLES" ? "S/ " : ""
    if (Number.isNaN(n)) return `${prefix}${value || "—"}`
    return `${prefix}${n.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`
}

const PendienteReciboRow = ({
    recibo,
    selected,
    onToggle,
}: {
    recibo: Recibo
    selected: boolean
    onToggle: () => void
}) => (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 transition hover:border-sky-200 hover:bg-sky-50/30 has-[:checked]:border-sky-300 has-[:checked]:bg-sky-50/50">
        <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
        />
        <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-800">
                    {recibo.serie}-{recibo.numero}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                    {recibo.comprobante === 2 ? "Boleta" : "Factura"}
                </span>
                {recibo.anulada && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                        Anulada local
                    </span>
                )}
                {recibo.anulada && recibo.resumen_id == null && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                        Pend. resumen
                    </span>
                )}
            </div>
            <p className="mt-0.5 text-sm text-slate-800">
                {getTitleCase(recibo.persona_nombres || "Sin nombre")}
            </p>
            <p className="text-xs text-slate-500">
                {recibo.persona_documento} · {formatAmount(recibo.total, recibo.moneda)}
            </p>
        </div>
    </label>
)

const GenerarResumenModal = ({ isOpen, onClose, onCreated }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const createResumen = useCreateResumen()

    const [fechaComunicacion, setFechaComunicacion] = useState(
        getDefaultIngresoFechaEmision(),
    )
    const [fechaEmision, setFechaEmision] = useState(getDefaultIngresoFechaEmision())
    const [fechaComunicacionError, setFechaComunicacionError] = useState("")
    const [fechaEmisionError, setFechaEmisionError] = useState("")
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const selectionInitializedForFecha = useRef("")

    useEffect(() => {
        if (isOpen) {
            const today = getDefaultIngresoFechaEmision()
            setFechaComunicacion(today)
            setFechaEmision(today)
            setFechaComunicacionError("")
            setFechaEmisionError("")
            setSelectedIds([])
            selectionInitializedForFecha.current = ""
        }
    }, [isOpen])

    useEffect(() => {
        selectionInitializedForFecha.current = ""
        setSelectedIds([])
    }, [fechaEmision])

    const fechaEmisionValida = isValidIngresoFechaEmision(fechaEmision)
    const fechaComunicacionValida = isValidIngresoFechaEmision(fechaComunicacion)

    const { data: pendientes = [], isLoading, isError, error, isFetching } =
        useGetResumenRecibosPendientes({
            access,
            fecha_emision: fechaEmision,
            comprobante_id: RECIBO_COMPROBANTE_BOLETA,
            enabled: isOpen && fechaEmisionValida,
        })

    useEffect(() => {
        if (
            isLoading ||
            pendientes.length === 0 ||
            selectionInitializedForFecha.current === fechaEmision
        ) {
            return
        }

        selectionInitializedForFecha.current = fechaEmision
        setSelectedIds(pendientes.map((item) => item.id_recibo))
    }, [isLoading, pendientes, fechaEmision])

    const allSelected =
        pendientes.length > 0 && selectedIds.length === pendientes.length

    const toggleAll = () => {
        if (allSelected) {
            setSelectedIds([])
            return
        }
        setSelectedIds(pendientes.map((item) => item.id_recibo))
    }

    const toggleOne = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        )
    }

    const selectedCount = useMemo(
        () => selectedIds.filter((id) => pendientes.some((p) => p.id_recibo === id)).length,
        [selectedIds, pendientes],
    )

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let ok = true
        if (!fechaComunicacionValida) {
            setFechaComunicacionError("Ingrese una fecha de comunicación válida")
            ok = false
        }
        if (!fechaEmisionValida) {
            setFechaEmisionError("Ingrese una fecha de emisión válida")
            ok = false
        }
        if (selectedIds.length === 0) {
            setMessage("Seleccione al menos un comprobante para el resumen")
            setType("error")
            setShow(true)
            ok = false
        }
        if (!ok) return

        try {
            await createResumen.mutateAsync({
                access,
                payload: {
                    fecha_comunicacion: fechaComunicacion.trim(),
                    fecha_emision: fechaEmision.trim(),
                    comprobante_id: RECIBO_COMPROBANTE_BOLETA,
                    recibo_ids: selectedIds,
                },
            })
            setMessage("Resumen generado correctamente")
            setType("success")
            setShow(true)
            onCreated?.()
            onClose()
        } catch (err) {
            setMessage(getIngresoBackendError(err))
            setType("error")
            setShow(true)
        }
    }

    return (
        <TopModal isOpen={isOpen} onClose={onClose} wide portal deepth={60}>
            <form
                onSubmit={handleSubmit}
                className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
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
                                Comunicar boletas a SUNAT: incluye emisiones nuevas y bajas
                                anuladas localmente pendientes de resumen.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="mb-4 grid shrink-0 gap-4 sm:grid-cols-2">
                    <div className="grid grid-cols-3 items-center gap-3">
                        <label
                            htmlFor="generar-resumen-fecha-comunicacion"
                            className="pl-2 text-xs font-semibold text-slate-700"
                        >
                            Fecha comunicación
                        </label>
                        <div className="col-span-2 flex items-center gap-2">
                            <input
                                id="generar-resumen-fecha-comunicacion"
                                type="date"
                                value={fechaComunicacion}
                                onChange={(e) => {
                                    setFechaComunicacion(e.target.value)
                                    setFechaComunicacionError("")
                                }}
                                className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            />
                            <span className="text-red-500">*</span>
                        </div>
                        {fechaComunicacionError && (
                            <p className="col-span-3 px-2 text-xs text-red-500">
                                {fechaComunicacionError}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-3 items-center gap-3">
                        <label
                            htmlFor="generar-resumen-fecha-emision"
                            className="pl-2 text-xs font-semibold text-slate-700"
                        >
                            Fecha emisión
                        </label>
                        <div className="col-span-2 flex items-center gap-2">
                            <input
                                id="generar-resumen-fecha-emision"
                                type="date"
                                value={fechaEmision}
                                onChange={(e) => {
                                    setFechaEmision(e.target.value)
                                    setFechaEmisionError("")
                                }}
                                className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            />
                            <span className="text-red-500">*</span>
                        </div>
                        {fechaEmisionError && (
                            <p className="col-span-3 px-2 text-xs text-red-500">
                                {fechaEmisionError}
                            </p>
                        )}
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    {fechaEmisionValida && pendientes.length > 0 && (
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800">
                            <span>
                                {selectedCount} de {pendientes.length} seleccionado
                                {pendientes.length === 1 ? "" : "s"} — emisión{" "}
                                {formatLocalDate(fechaEmision)}
                            </span>
                            <div className="flex items-center gap-2">
                                {isFetching && !isLoading && (
                                    <span className="font-normal text-slate-500">
                                        Actualizando…
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={toggleAll}
                                    className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    {allSelected ? "Desmarcar todos" : "Seleccionar todos"}
                                </button>
                            </div>
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

                    {!isLoading && !isError && fechaEmisionValida && pendientes.length === 0 && (
                        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-10 text-center text-sm text-slate-500">
                            No hay comprobantes pendientes de SUNAT para{" "}
                            {formatLocalDate(fechaEmision)}.
                        </p>
                    )}

                    {!isLoading && pendientes.length > 0 && (
                        <ul className="space-y-2">
                            {pendientes.map((item) => (
                                <li key={item.id_recibo}>
                                    <PendienteReciboRow
                                        recibo={item}
                                        selected={selectedIds.includes(item.id_recibo)}
                                        onToggle={() => toggleOne(item.id_recibo)}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-4 flex shrink-0 justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={createResumen.isPending}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={
                            createResumen.isPending ||
                            isLoading ||
                            pendientes.length === 0 ||
                            selectedIds.length === 0
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {createResumen.isPending ? "Generando…" : "Generar resumen"}
                    </button>
                </div>
            </form>
        </TopModal>
    )
}

export default GenerarResumenModal
