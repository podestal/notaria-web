import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getKardexService, { KardexPage, CreateUpdateKardex } from "../../../services/api/kardexService"

export interface CreateKardexData {
    kardex: CreateUpdateKardex
}

interface Props {
    idtipkar: number
}

const useCreateKardex = ({ idtipkar }: Props): UseMutationResult<KardexPage, Error, CreateKardexData> => {
    const queryClient = useQueryClient()
    const kardexService = getKardexService({})

    return useMutation({
        mutationFn: (data: CreateKardexData) => kardexService.post(data.kardex),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['kardex list', 1, idtipkar] })
            console.log('Kardex created successfully:', res);
            
        },
        onError: (error) => {
            console.error('Error creating kardex:', error)
        }
    })
}

export default useCreateKardex