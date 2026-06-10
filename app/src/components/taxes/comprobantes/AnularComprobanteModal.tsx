import { FormEvent, useEffect, useState } from "react"
import { AlertTriangle, Ban } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useAnularIngreso from "../../../hooks/taxes/ingresos/useAnularIngreso"
import useAnularRecibo from "../../../hooks/taxes/recibos/useAnularRecibo"
import getTitleCase from "../../../utils/getTitleCase"
import TopModal from "../../ui/TopModal"
import { getIngresoBackendError } from "../controlInterno/ingresoFormShared"
import {
    type ComprobanteItem,
    type ComprobanteVariant,
    getComprobanteItemId,
    getComprobanteSerieNumero,
} from "./comprobanteTypes"

interface Props {
    variant: ComprobanteVariant
    item: ComprobanteItem | null
    onClose: () => void
    onSuccess?: () => void
}

const AnularComprobanteModal = ({ variant, item, onClose, onSuccess }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const itemId = item ? getComprobanteItemId(item) : 0

    const anularIngreso = useAnularIngreso({
        id_ingreso: variant === "ingreso" ? itemId : 0,
    })
    const anularRecibo = useAnularRecibo({
        id_recibo: variant === "recibo" ? itemId : 0,
    })

    const [motivoBaja, setMotivoBaja] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (item) {
            setMotivoBaja("")
            setError("")
        }
    }, [item])

    if (!item) return null

    const comprobante = getComprobanteSerieNumero(item)
    const isPending =
        variant === "ingreso" ? anularIngreso.isPending : anularRecibo.isPending
    const entityLabel = variant === "ingreso" ? "ingreso" : "recibo"

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const trimmed = motivoBaja.trim()
        if (!trimmed) {
            setError("Ingrese el motivo de anulación")
            return
        }

        setError("")

        try {
            if (variant === "ingreso") {
                await anularIngreso.mutateAsync({
                    access,
                    payload: { motivo_baja: trimmed },
                })
            } else {
                await anularRecibo.mutateAsync({
                    access,
                    payload: { motivo_baja: trimmed },
                })
            }
            setMessage(`${entityLabel.charAt(0).toUpperCase()}${entityLabel.slice(1)} anulado correctamente`)
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
        <TopModal isOpen={Boolean(item)} onClose={onClose} portal deepth={60}>
            <div className="mx-auto w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-2.5">
                        <Ban className="h-5 w-5 text-red-600" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-slate-900">
                            Anular {entityLabel}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                            Esta acción marcará el comprobante como anulado. Indique el
                            motivo para continuar.
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
                    <p className="font-mono text-xs font-semibold text-slate-500">
                        {comprobante}
                    </p>
                    <p className="mt-0.5 font-medium text-slate-900">
                        {getTitleCase(item.persona_nombres || "Sin nombre")}
                    </p>
                    <p className="text-xs text-slate-500">
                        {item.persona_documento || "—"}
                    </p>
                </div>

                <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                    <AlertTriangle
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                        aria-hidden
                    />
                    <p className="text-xs leading-relaxed text-amber-900">
                        Una vez anulado, el {entityLabel} quedará registrado como baja y no
                        podrá revertirse desde esta pantalla.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <label className="block text-xs">
                        <span className="mb-1.5 block font-semibold text-slate-700">
                            Motivo de baja
                        </span>
                        <textarea
                            value={motivoBaja}
                            onChange={(e) => {
                                setMotivoBaja(e.target.value)
                                setError("")
                            }}
                            rows={3}
                            placeholder="Ej. ERROR, duplicado, solicitud del cliente…"
                            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 ${
                                error
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-slate-300 focus:border-red-300 focus:ring-red-100"
                            }`}
                        />
                        {error && (
                            <span className="mt-1 block text-xs text-red-600">{error}</span>
                        )}
                    </label>

                    <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? "Anulando…" : "Confirmar anulación"}
                        </button>
                    </div>
                </form>
            </div>
        </TopModal>
    )
}

export default AnularComprobanteModal
