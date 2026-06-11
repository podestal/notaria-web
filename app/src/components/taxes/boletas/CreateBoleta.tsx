import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useCreateRecibo from "../../../hooks/taxes/recibos/useCreateRecibo"
import type { CreateUpdateRecibo } from "../../../services/taxes/recibosService"
import IngresoForm from "../controlInterno/IngresoForm"
import {
    getEmptyIngresoFormValues,
    getIngresoBackendError,
} from "../controlInterno/ingresoFormShared"

interface Props {
    onDone?: () => void
}

const CreateBoleta = ({ onDone }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const createRecibo = useCreateRecibo()

    const handleCreate = async (values: CreateUpdateRecibo) => {
        await createRecibo.mutateAsync(
            { access, recibo: values },
            {
                onSuccess: () => {
                    setMessage("Boleta creada correctamente")
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
            variant="boleta"
            initialValues={getEmptyIngresoFormValues()}
            onSubmit={handleCreate}
            submitLabel="Crear boleta"
            loading={createRecibo.isPending}
        />
    )
}

export default CreateBoleta
