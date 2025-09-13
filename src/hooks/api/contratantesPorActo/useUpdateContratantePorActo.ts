import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query"
import getContratantesPorActoService, { ContratantesPorActo, CreateUpdateContratantesPorActo } from "../../../services/api/contratantesPorActoService"

export interface UpdateContratantePorActoData {
    access: string
    contratantePorActo: CreateUpdateContratantesPorActo
}

interface Props {
    kardex: string
    id: number
}

const useUpdateContratantePorActo = ({ kardex, id }: Props): UseMutationResult<ContratantesPorActo, Error, UpdateContratantePorActoData> => {
    const queryClient = useQueryClient()
    const contratantesPorActoService = getContratantesPorActoService({ id })
    return useMutation({
        mutationFn: (data: UpdateContratantePorActoData) => contratantesPorActoService.update(data.contratantePorActo, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contratantesPorActoByKardex', kardex] })
        },
        onError: (error) => {
            console.error(error)
        }
    })
}

export default useUpdateContratantePorActo
