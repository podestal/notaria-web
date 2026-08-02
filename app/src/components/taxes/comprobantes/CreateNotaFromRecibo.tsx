import { useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useCreateRecibo from "../../../hooks/taxes/recibos/useCreateRecibo"
import useGetReciboDetail from "../../../hooks/taxes/recibos/useGetReciboDetail"
import useGetMonedas from "../../../hooks/taxes/moneda/useGetMonedas"
import { findPersonaByNumeroDocumento } from "../../../services/taxes/findPersonaByNumeroDocumento"
import type { CreateUpdateRecibo, Recibo } from "../../../services/taxes/recibosService"
import { getSunatNotification } from "../../../services/taxes/sunatStatus"
import { resolvePersonaDireccion } from "../personas/personaFormShared"
import IngresoForm from "../controlInterno/IngresoForm"
import {
    getDefaultIngresoFechaEmision,
    getEmptyIngresoFormValues,
    getIngresoBackendError,
    reciboToFormValues,
    type IngresoFormValues,
} from "../controlInterno/ingresoFormShared"
import {
    EMISION_FORM_VARIANT_CONFIG,
    type EmisionFormVariant,
} from "./comprobanteFormConfig"

type NotaVariant = Extract<EmisionFormVariant, "nota_credito" | "nota_debito">

interface Props {
    recibo: Recibo
    variant: NotaVariant
    onClose: () => void
    onDone?: () => void
}

const CreateNotaFromRecibo = ({ recibo, variant, onClose, onDone }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const notify = useNotificationsStore((s) => s.notify)
    const createRecibo = useCreateRecibo()
    const config = EMISION_FORM_VARIANT_CONFIG[variant]
    const { data: monedas = [], isLoading: loadingMonedas } = useGetMonedas({
        access,
    })

    const { data, isLoading, isError, error, isSuccess } = useGetReciboDetail({
        access,
        id_recibo: recibo.id_recibo,
        enabled: Boolean(access),
    })

    const [initialValues, setInitialValues] = useState<IngresoFormValues>(
        getEmptyIngresoFormValues,
    )
    const [ready, setReady] = useState(false)
    const [personaError, setPersonaError] = useState("")

    useEffect(() => {
        if (!isSuccess || !data || loadingMonedas) return

        let cancelled = false

        const hydrate = async () => {
            setReady(false)
            setPersonaError("")

            const detailRecibo = data.recibo
            const items = data.items ?? []
            let personaId = 0
            let direccion = detailRecibo.direccion?.trim() || ""

            try {
                const persona = await findPersonaByNumeroDocumento(
                    access,
                    detailRecibo.persona_documento || "",
                )
                if (persona) {
                    personaId = persona.id_persona
                    if (!direccion) {
                        direccion = resolvePersonaDireccion(persona)
                    }
                } else if (detailRecibo.persona_documento) {
                    setPersonaError(
                        "No se encontró la persona del comprobante. Búsquela o regístrela en el formulario.",
                    )
                }
            } catch {
                setPersonaError(
                    "No se pudo resolver la persona del comprobante. Búsquela manualmente.",
                )
            }

            if (cancelled) return

            setInitialValues(
                reciboToFormValues(detailRecibo, [], monedas, {
                    keepSerie: false,
                    items,
                    persona_id: personaId,
                    direccion,
                    fecha_emision: getDefaultIngresoFechaEmision(),
                }),
            )
            setReady(true)
        }

        void hydrate()
        return () => {
            cancelled = true
        }
    }, [access, data, isSuccess, loadingMonedas, monedas.length])

    const formKey = useMemo(
        () =>
            `${variant}-${recibo.id_recibo}-${ready ? "ready" : "loading"}-${initialValues.persona_id}-${initialValues.lineas.length}-${initialValues.moneda_id}`,
        [variant, recibo.id_recibo, ready, initialValues],
    )

    const handleCreate = async (values: CreateUpdateRecibo) => {
        try {
            const response = await createRecibo.mutateAsync({ access, recibo: values })
            const notification = getSunatNotification(
                response.sunat,
                config.createSuccessMessage,
            )
            notify(notification.type, notification.message, {
                persistent: Boolean(notification.persistent),
            })
            onDone?.()
            onClose()
        } catch (err) {
            notify("error", getIngresoBackendError(err))
        }
    }

    if (isLoading || loadingMonedas || !ready) {
        return (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8">
                <p className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Cargando datos del comprobante…
                </p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4">
                <p className="text-sm text-rose-700">
                    {error instanceof Error
                        ? error.message
                        : "No se pudo cargar el detalle del comprobante."}
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700"
                >
                    Cerrar
                </button>
            </div>
        )
    }

    const detailRecibo = data?.recibo ?? recibo

    return (
        <div>
            <div className="mb-4 border-b border-slate-100 pb-3">
                <h4 className="text-base font-semibold text-slate-800">
                    {variant === "nota_credito"
                        ? "Nueva nota de crédito"
                        : "Nueva nota de débito"}
                </h4>
                <p className="mt-0.5 text-xs text-slate-500">
                    Desde {detailRecibo.serie}-{detailRecibo.numero}
                    {initialValues.lineas.length > 0
                        ? ` · ${initialValues.lineas.length} ítem${initialValues.lineas.length === 1 ? "" : "s"} precargado${initialValues.lineas.length === 1 ? "" : "s"} (puede editarlos).`
                        : " · sin ítems en el comprobante; agréguelos abajo."}
                </p>
                {personaError && (
                    <p className="mt-2 text-xs text-amber-700">{personaError}</p>
                )}
            </div>

            <IngresoForm
                key={formKey}
                variant={variant}
                initialValues={initialValues}
                onSubmit={handleCreate}
                submitLabel={config.createSubmitLabel}
                loading={createRecibo.isPending}
                onCancel={onClose}
                kardex={detailRecibo.kardex || undefined}
                useKardexPersona={false}
                reciboModificaId={detailRecibo.id_recibo}
            />
        </div>
    )
}

export default CreateNotaFromRecibo
