import { useMemo } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useCreateRecibo from "../../../hooks/taxes/recibos/useCreateRecibo"
import type { CreateUpdateRecibo } from "../../../services/taxes/recibosService"
import IngresoForm from "../controlInterno/IngresoForm"
import {
    getEmptyIngresoFormValues,
    getIngresoBackendError,
} from "../controlInterno/ingresoFormShared"
import {
    EMISION_FORM_VARIANT_CONFIG,
    type EmisionFormVariant,
} from "./comprobanteFormConfig"

interface Props {
    variant: Extract<EmisionFormVariant, "boleta" | "factura" | "nota_credito">
    onDone?: () => void
    kardex?: string
}

const CreateRecibo = ({ variant, onDone, kardex }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const createRecibo = useCreateRecibo()
    const config = EMISION_FORM_VARIANT_CONFIG[variant]
    const initialValues = useMemo(() => getEmptyIngresoFormValues(), [])

    const handleCreate = async (values: CreateUpdateRecibo) => {
        await createRecibo.mutateAsync(
            { access, recibo: values },
            {
                onSuccess: () => {
                    setMessage(config.createSuccessMessage)
                    setType("success")
                    setShow(true)
                    onDone?.()
                },
                onError: (error) => {
                    setMessage(getIngresoBackendError(error))
                    setType("error")
                    setShow(true)
                },
            },
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
