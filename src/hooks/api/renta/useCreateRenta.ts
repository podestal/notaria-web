import { useMutation, UseMutationResult } from "@tanstack/react-query";
import getRentaService, { Renta, CreateUpdateRenta } from "../../../services/api/rentaService";


interface CreateRentaData {
    access: string
    renta: CreateUpdateRenta
}

const useCreateRenta = (): UseMutationResult<Renta, Error, CreateRentaData> => {
    const rentaService = getRentaService({  })

    return useMutation({
        mutationFn: (data: CreateRentaData) => rentaService.post(data.renta, data.access),
        onSuccess: res => {
            console.log('Renta creada', res);
            
        },
        onError: err => {
            console.log('Error al crear la renta', err);
        }
    })
}

export default useCreateRenta