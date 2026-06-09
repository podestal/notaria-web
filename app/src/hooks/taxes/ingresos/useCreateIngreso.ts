import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getIngresosServiceSingle,
    type CreateUpdateIngreso,
    type Ingreso,
} from "../../../services/taxes/ingresosService"

export interface CreateIngresoData {
    access: string
    ingreso: CreateUpdateIngreso
}

const useCreateIngreso = (): UseMutationResult<Ingreso, Error, CreateIngresoData> => {
    const queryClient = useQueryClient()
    const service = getIngresosServiceSingle()

    return useMutation({
        mutationFn: (data: CreateIngresoData) =>
            service.post(data.ingreso, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-ingresos"] })
        },
    })
}

export default useCreateIngreso
