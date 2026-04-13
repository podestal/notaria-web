import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import getContratantesService, { Contratante } from "../../../services/api/contratantesService"

interface RemoveContratanteData {
    access: string
}

interface Props {
    kardex: string
    contratanteId: string
}

const useRemoveContratante = ({ kardex, contratanteId }: Props): UseMutationResult<Contratante, Error, RemoveContratanteData> => {
    const contratantesService = getContratantesService({ contratanteId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: RemoveContratanteData) => contratantesService.delete(data.access),
        onSuccess: () => {
            console.log('Contratante removed successfully')
            queryClient.invalidateQueries({ queryKey: ['contratantes by kardex', kardex] })
        },
        onError: (error) => {
            console.error("Error removing Contratante:", error)
        }
    })
}
export default useRemoveContratante