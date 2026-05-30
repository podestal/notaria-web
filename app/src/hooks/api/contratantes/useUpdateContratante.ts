import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getContratantesService, { Contratante, CreateUpdateContratante } from "../../../services/api/contratantesService"

export interface UpdateContratanteData {
    access: string
    contratante: CreateUpdateContratante
}

interface Props {
    contratanteId: string
    kardex: string
    /** Debe coincidir con `useRetrieveKardex`: `queryKey: ['kardex', id]` (ej. `['kardex', 5248]`). */
    idkardex?: number
}

const useUpdateContratante = ({
    kardex,
    contratanteId,
    idkardex,
}: Props): UseMutationResult<Contratante, Error, UpdateContratanteData> => {
    const contratantesService = getContratantesService({ contratanteId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateContratanteData) => contratantesService.update(data.contratante, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contratantes by kardex", kardex] })
            queryClient.invalidateQueries({ queryKey: ["contratante", contratanteId] })
            const idNum = idkardex != null ? Number(idkardex) : NaN
            if (Number.isFinite(idNum) && idNum > 0) {
                queryClient.invalidateQueries({ queryKey: ["kardex", idNum], exact: true })
            }
        },
        onError: (error) => {
            console.error("Error updating Contratante:", error)
        },
    })
}
export default useUpdateContratante
