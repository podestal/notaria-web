import { useMutation, UseMutationResult } from '@tanstack/react-query'
import getRepresentantesService, {
    CreateUpdateRepresentante,
    Representante,
} from '../../../services/api/representantesService'

export interface UpdateRepresentanteData {
    access: string
    representanteId: number
    representante: CreateUpdateRepresentante
}

const useUpdateRepresentante = (): UseMutationResult<
    Representante,
    Error,
    UpdateRepresentanteData
> => {
    return useMutation({
        mutationFn: (data: UpdateRepresentanteData) => {
            const service = getRepresentantesService({
                representanteId: String(data.representanteId),
            })
            return service.update(data.representante, data.access)
        },
    })
}

export default useUpdateRepresentante
