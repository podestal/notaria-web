import { useMemo } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useCreateIngreso from "../../../hooks/taxes/ingresos/useCreateIngreso"
import type { CreateUpdateIngreso } from "../../../services/taxes/ingresosService"
import IngresoForm from "./IngresoForm"
import { getEmptyIngresoFormValues, getIngresoBackendError } from "./ingresoFormShared"

interface Props {
    onDone?: () => void
}

const CreateIngreso = ({ onDone }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const createIngreso = useCreateIngreso()
    const initialValues = useMemo(() => getEmptyIngresoFormValues(), [])

    const handleCreate = async (values: CreateUpdateIngreso) => {
        await createIngreso.mutateAsync(
            { access, ingreso: values },
            {
                onSuccess: () => {
                    setMessage("Ingreso creado correctamente")
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
            initialValues={initialValues}
            onSubmit={handleCreate}
            submitLabel="Crear ingreso"
            loading={createIngreso.isPending}
        />
    )
}

export default CreateIngreso
