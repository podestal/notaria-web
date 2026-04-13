import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getContratantesService, { Contratante, CreateUpdateContratante } from "../../../services/api/contratantesService"

export interface UpdateContratanteData {
    access: string
    contratante: CreateUpdateContratante
}

interface Props {
    contratanteId: string
    kardex: string
}

const useUpdateContratante = ({ kardex, contratanteId }: Props): UseMutationResult<Contratante, Error, UpdateContratanteData> => {
    const contratantesService = getContratantesService({ contratanteId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateContratanteData) => contratantesService.update(data.contratante, data.access),
        onSuccess: () => {
            console.log('Contratante updated successfully');
            queryClient.invalidateQueries({ queryKey: ['contratantes by kardex', kardex] })
        },
        onError: (error) => {
            console.error("Error updating Contratante:", error)
        }
    })
}
export default useUpdateContratante