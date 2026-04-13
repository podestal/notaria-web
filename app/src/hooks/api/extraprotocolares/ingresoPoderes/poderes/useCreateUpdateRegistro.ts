import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getPoderRegistroService, { CreateUpdatePoderRegistro, PoderRegistro } from "../../../../../services/api/extraprotocolares/poderRegistroService"

interface CreateUpdateRegistroData {
    registro: CreateUpdatePoderRegistro,
    access: string
}

interface Props {
    idPoderRegistro?: number;
    poderId: number;
}

const useCreateUpdateRegistro = ({ idPoderRegistro, poderId }: Props): UseMutationResult<PoderRegistro, Error, CreateUpdateRegistroData> => {
    const queryClient = useQueryClient()
    const poderRegistroService = idPoderRegistro ? getPoderRegistroService({idPoderRegistro }) :getPoderRegistroService({})
    return useMutation({
        mutationFn: (data: CreateUpdateRegistroData) => {
            if (idPoderRegistro) {
                return poderRegistroService.update(data.registro, data.access)
            } else {
                return poderRegistroService.post(data.registro, data.access)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['poderRegistro', poderId] })
        },
        onError: (error) => {
            console.log(error)
        }
    })
}

export default useCreateUpdateRegistro