import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import { CreateUpdateKardex, getSingleKardexService, Kardex } from "../../../services/api/kardexService"

export interface CreateKardexData {
    kardex: CreateUpdateKardex
    access: string
}

interface Props {
    idtipkar: number
}

const useCreateKardex = ({ idtipkar }: Props): UseMutationResult<Kardex, Error, CreateKardexData> => {
    const queryClient = useQueryClient()
    const kardexService = getSingleKardexService({})

    return useMutation({
        mutationFn: (data: CreateKardexData) => kardexService.post(data.kardex, data.access),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['kardex list', "1", idtipkar] })
            queryClient.invalidateQueries({ queryKey: ["contratantes by kardex",res.kardex] })
            // console.log('Kardex created successfully:', res);
            
        },
        onError: (error) => {
            console.error('Error creating kardex:', error)
        }
    })
}

export default useCreateKardex