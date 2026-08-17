import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    taxesUsuariosCreateService,
    type CreateTaxesUsuarioPayload,
    type TaxesUsuario,
} from "../../../services/taxes/taxesUsuariosService"

export interface CreateTaxesUsuarioData {
    access: string
    payload: CreateTaxesUsuarioPayload
}

const useCreateTaxesUsuario = (): UseMutationResult<
    TaxesUsuario,
    Error,
    CreateTaxesUsuarioData
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateTaxesUsuarioData) =>
            taxesUsuariosCreateService.post(data.payload, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-usuarios"] })
        },
        onError: (error: Error) => {
            console.error(error)
        },
    })
}

export default useCreateTaxesUsuario
