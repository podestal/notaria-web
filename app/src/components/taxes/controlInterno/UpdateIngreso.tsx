import { useMemo } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useGetMonedas from "../../../hooks/taxes/moneda/useGetMonedas"
import useGetSeriesControlInterno from "../../../hooks/taxes/series/useGetSeriesControlInterno"
import useUpdateIngreso from "../../../hooks/taxes/ingresos/useUpdateIngreso"
import type { CreateUpdateIngreso, Ingreso } from "../../../services/taxes/ingresosService"
import IngresoForm from "./IngresoForm"
import { getIngresoBackendError, ingresoToFormValues } from "./ingresoFormShared"

interface Props {
    ingreso: Ingreso
    onCancel: () => void
}

const UpdateIngreso = ({ ingreso, onCancel }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const updateIngreso = useUpdateIngreso({ id_ingreso: ingreso.id_ingreso })
    const { data: series = [] } = useGetSeriesControlInterno({ access })
    const { data: monedas = [] } = useGetMonedas({ access })

    const initialValues = useMemo(
        () => ingresoToFormValues(ingreso, series, monedas),
        [ingreso, series, monedas],
    )

    const handleUpdate = async (values: CreateUpdateIngreso) => {
        await updateIngreso.mutateAsync(
            { access, ingreso: values },
            {
                onSuccess: () => {
                    setMessage("Ingreso actualizado correctamente")
                    setType("success")
                    setShow(true)
                    onCancel()
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
            onSubmit={handleUpdate}
            submitLabel="Actualizar ingreso"
            loading={updateIngreso.isPending}
            onCancel={onCancel}
            anulada={ingreso.anulada}
            canjeada={ingreso.canjeada}
        />
    )
}

export default UpdateIngreso
