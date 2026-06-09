import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    controlInternoIngresosService,
    type CreateUpdateIngreso,
    type Ingreso,
} from "../../../services/taxes/ingresosService"

export interface CreateIngresoData {
    access: string
    ingreso: CreateUpdateIngreso
}

const useCreateIngreso = (): UseMutationResult<Ingreso, Error, CreateIngresoData> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateIngresoData) =>
            controlInternoIngresosService.post(data.ingreso, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-ingresos"] })
        },
    })
}

export default useCreateIngreso
