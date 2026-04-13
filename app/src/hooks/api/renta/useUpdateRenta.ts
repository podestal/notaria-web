import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getRentaService, { CreateUpdateRenta, Renta} from "../../../services/api/rentaService"

export interface UpdateRentaData {
    access: string
    renta: CreateUpdateRenta
}

interface Props {
    idrenta: string
    kardex: string
}

const useUpdateRenta = ({ idrenta, kardex }: Props): UseMutationResult<Renta, Error, UpdateRentaData> => {
    const rentaService = getRentaService({ idrenta })
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: (data: UpdateRentaData) => rentaService.update(data.renta, data.access),
        onSuccess: () => {
            console.log('Renta actualizada correctamente');
            queryClient.invalidateQueries({ queryKey: ['contratantesPorActoByKardex', kardex] })
        },
        onError: (error) => {
            console.log(error)
        }
    })
}

export default useUpdateRenta