import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getIngresoCanjearService,
    type CanjearIngresoPayload,
    type Ingreso,
} from "../../../services/taxes/ingresosService"

export interface CanjearIngresoData {
    access: string
    payload: CanjearIngresoPayload
}

interface Props {
    id_ingreso: number
}

const useCanjearIngreso = ({
    id_ingreso,
}: Props): UseMutationResult<Ingreso, Error, CanjearIngresoData> => {
    const queryClient = useQueryClient()
    const service = getIngresoCanjearService(id_ingreso)

    return useMutation({
        mutationFn: (data: CanjearIngresoData) =>
            service.post(data.payload, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-ingresos"] })
        },
    })
}

export default useCanjearIngreso
