import { useMemo } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useCreateRecibo from "../../../hooks/taxes/recibos/useCreateRecibo"
import type { CreateUpdateRecibo } from "../../../services/taxes/recibosService"
import { getSunatNotification } from "../../../services/taxes/sunatStatus"
import IngresoForm from "../controlInterno/IngresoForm"
import {
    getEmptyIngresoFormValues,
    getIngresoBackendError,
} from "../controlInterno/ingresoFormShared"
import {
    EMISION_FORM_VARIANT_CONFIG,
    type EmisionFormVariant,
} from "./comprobanteFormConfig"
import RecibosModificablesList from "./RecibosModificablesList"

interface Props {
    variant: Extract<EmisionFormVariant, "boleta" | "factura" | "nota_credito" | "nota_debito">
    onDone?: () => void
    kardex?: string
}

const CreateRecibo = ({ variant, onDone, kardex }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const notify = useNotificationsStore((s) => s.notify)
    const createRecibo = useCreateRecibo()
    const config = EMISION_FORM_VARIANT_CONFIG[variant]
    const initialValues = useMemo(() => getEmptyIngresoFormValues(), [])
    const showModificables =
        variant === "nota_credito" || variant === "nota_debito"

    const handleCreate = async (values: CreateUpdateRecibo) => {
        try {
            const response = await createRecibo.mutateAsync({ access, recibo: values })
            const isBoleta = variant === "boleta"
            const notification = isBoleta
                ? { message: config.createSuccessMessage, type: "success" as const, persistent: false }
                : getSunatNotification(response.sunat, config.createSuccessMessage)

            notify(notification.type, notification.message, {
                persistent: Boolean(notification.persistent),
            })
            onDone?.()
        } catch (error) {
            notify("error", getIngresoBackendError(error))
        }
    }

    if (showModificables) {
        return (
            <RecibosModificablesList
                title={
                    variant === "nota_credito"
                        ? "Comprobantes para nota de crédito"
                        : "Comprobantes para nota de débito"
                }
                description="Elija un comprobante y emita la nota de crédito o débito con los datos precargados."
            />
        )
    }

    return (
        <IngresoForm
            key={variant}
            variant={variant}
            initialValues={initialValues}
            onSubmit={handleCreate}
            submitLabel={config.createSubmitLabel}
            loading={createRecibo.isPending}
            kardex={kardex}
        />
    )
}

export default CreateRecibo
