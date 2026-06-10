import { FormEvent, useEffect, useState } from "react"
import { ArrowLeftRight, FileText, Receipt } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useCanjearIngreso from "../../../hooks/taxes/ingresos/useCanjearIngreso"
import {
    CANJE_COMPROBANTE_OPTIONS,
    type CanjeComprobanteTipo,
    type Ingreso,
} from "../../../services/taxes/ingresosService"
import getTitleCase from "../../../utils/getTitleCase"
import TopModal from "../../ui/TopModal"
import {
    getDefaultIngresoFechaEmision,
    getIngresoBackendError,
    isValidIngresoFechaEmision,
} from "./ingresoFormShared"

interface Props {
    ingreso: Ingreso | null
    onClose: () => void
    onSuccess?: () => void
}

const CanjearIngresoModal = ({ ingreso, onClose, onSuccess }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const canjearIngreso = useCanjearIngreso({
        id_ingreso: ingreso?.id_ingreso ?? 0,
    })

    const [tipo, setTipo] = useState<CanjeComprobanteTipo>("boleta")
    const [fechaEmision, setFechaEmision] = useState(getDefaultIngresoFechaEmision())
    const [observaciones, setObservaciones] = useState("")
    const [fechaError, setFechaError] = useState("")

    useEffect(() => {
        if (ingreso) {
            setTipo("boleta")
            setFechaEmision(getDefaultIngresoFechaEmision())
            setObservaciones("")
            setFechaError("")
        }
    }, [ingreso])

    if (!ingreso) return null

    const comprobante = `${ingreso.serie || "—"}-${ingreso.numero ?? "—"}`
    const selected = CANJE_COMPROBANTE_OPTIONS[tipo]

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!isValidIngresoFechaEmision(fechaEmision)) {
            setFechaError("Ingrese una fecha de emisión válida")
            return
        }

        setFechaError("")

        try {
            await canjearIngreso.mutateAsync({
                access,
                payload: {
                    serie: selected.serie,
                    comprobante_id: selected.comprobante_id,
                    observaciones: observaciones.trim(),
                    fecha_emision: fechaEmision.trim(),
                },
            })
            setMessage(`Ingreso canjeado a ${selected.label} correctamente`)
            setType("success")
            setShow(true)
            onSuccess?.()
            onClose()
        } catch (err) {
            setMessage(getIngresoBackendError(err))
            setType("error")
            setShow(true)
        }
    }

    return (
        <TopModal isOpen={Boolean(ingreso)} onClose={onClose} portal deepth={60}>
            <div className="mx-auto w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5">
                        <ArrowLeftRight className="h-5 w-5 text-emerald-600" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-slate-900">
                            Canjear ingreso
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                            Emita una boleta o factura a partir de este comprobante de
                            control interno.
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
                    <p className="font-mono text-xs font-semibold text-slate-500">
                        {comprobante}
                    </p>
                    <p className="mt-0.5 font-medium text-slate-900">
                        {getTitleCase(ingreso.persona_nombres || "Sin nombre")}
                    </p>
                    <p className="text-xs text-slate-500">
                        {ingreso.persona_documento || "—"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <fieldset>
                        <legend className="mb-2 block text-xs font-semibold text-slate-700">
                            Tipo de comprobante
                        </legend>
                        <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(CANJE_COMPROBANTE_OPTIONS) as CanjeComprobanteTipo[]).map(
                                (key) => {
                                    const option = CANJE_COMPROBANTE_OPTIONS[key]
                                    const active = tipo === key
                                    const Icon = key === "factura" ? FileText : Receipt

                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setTipo(key)}
                                            className={`rounded-lg border px-3 py-3 text-left transition ${
                                                active
                                                    ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                                                        active
                                                            ? "border-emerald-300 bg-white text-emerald-700"
                                                            : "border-slate-200 bg-slate-50 text-slate-600"
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4" aria-hidden />
                                                </span>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {option.label}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">
                                                        {option.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                },
                            )}
                        </div>
                    </fieldset>

                    <label className="block text-xs">
                        <span className="mb-1.5 block font-semibold text-slate-700">
                            Fecha de emisión
                        </span>
                        <input
                            type="date"
                            value={fechaEmision}
                            onChange={(e) => {
                                setFechaEmision(e.target.value)
                                setFechaError("")
                            }}
                            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 ${
                                fechaError
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-slate-300 focus:border-emerald-300 focus:ring-emerald-100"
                            }`}
                        />
                        {fechaError && (
                            <span className="mt-1 block text-xs text-red-600">{fechaError}</span>
                        )}
                    </label>

                    <label className="block text-xs">
                        <span className="mb-1.5 block font-semibold text-slate-700">
                            Observaciones
                        </span>
                        <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            rows={2}
                            placeholder="Opcional"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                        />
                    </label>

                    <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                        Se emitirá{" "}
                        <span className="font-semibold text-slate-800">{selected.label}</span>{" "}
                        con serie{" "}
                        <span className="font-mono font-semibold text-slate-800">
                            {selected.serie}
                        </span>
                        .
                    </p>

                    <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={canjearIngreso.isPending}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={canjearIngreso.isPending}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {canjearIngreso.isPending ? "Canjeando…" : "Confirmar canje"}
                        </button>
                    </div>
                </form>
            </div>
        </TopModal>
    )
}

export default CanjearIngresoModal
