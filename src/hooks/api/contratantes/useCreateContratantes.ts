import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import getContratantesService, { Contratante, CreateUpdateContratante } from "../../../services/api/contratantesService"

export interface CreateContratanteData {
    access: string
    contratante: CreateUpdateContratante
}

interface Props {
    idcliente: string
    kardex: string
}

const useCreateContratante = ({ idcliente, kardex }: Props): UseMutationResult<Contratante, Error, CreateContratanteData> => {
    const contratantesService = getContratantesService({ })
    const params = { idcliente }
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateContratanteData) => contratantesService.post(data.contratante, data.access, params),
        onSuccess: () => {
            console.log('Contratante created successfully');
            queryClient.invalidateQueries({ queryKey: ['contratantes by kardex', kardex] })
        },
        onError: (error) => {
            console.error("Error creating Contratante:", error)
        }
    })
}
export default useCreateContratante