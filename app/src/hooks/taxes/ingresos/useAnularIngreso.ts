import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getIngresoAnularService,
    type AnularIngresoPayload,
    type Ingreso,
} from "../../../services/taxes/ingresosService"

export interface AnularIngresoData {
    access: string
    payload: AnularIngresoPayload
}

interface Props {
    id_ingreso: number
}

const useAnularIngreso = ({
    id_ingreso,
}: Props): UseMutationResult<Ingreso, Error, AnularIngresoData> => {
    const queryClient = useQueryClient()
    const service = getIngresoAnularService(id_ingreso)

    return useMutation({
        mutationFn: (data: AnularIngresoData) =>
            service.post(data.payload, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-ingresos"] })
        },
    })
}

export default useAnularIngreso
