import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import getRentaService, { Renta, CreateUpdateRenta } from "../../../services/api/rentaService";


interface CreateRentaData {
    access: string
    renta: CreateUpdateRenta
}

interface Props {
    kardex: string
}

const useCreateRenta = ({ kardex }: Props): UseMutationResult<Renta, Error, CreateRentaData> => {
    const rentaService = getRentaService({  })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateRentaData) => rentaService.post(data.renta, data.access),
        onSuccess: res => {
            console.log('Renta creada', res);
            queryClient.invalidateQueries({ queryKey: ['contratantesPorActoByKardex', kardex] })
        },
        onError: err => {
            console.log('Error al crear la renta', err);
        }
    })
}

export default useCreateRenta