import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getIngresosServiceSingle,
    type CreateUpdateIngreso,
    type Ingreso,
} from "../../../services/taxes/ingresosService"

export interface UpdateIngresoData {
    access: string
    ingreso: CreateUpdateIngreso
}

interface Props {
    id_ingreso: number
}

const useUpdateIngreso = ({
    id_ingreso,
}: Props): UseMutationResult<Ingreso, Error, UpdateIngresoData> => {
    const queryClient = useQueryClient()
    const service = getIngresosServiceSingle(id_ingreso)

    return useMutation({
        mutationFn: (data: UpdateIngresoData) =>
            service.update(data.ingreso, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-ingresos"] })
        },
    })
}

export default useUpdateIngreso
