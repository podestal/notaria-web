import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getPersonasServiceSingle,
    type CreateUpdatePersona,
    type Persona,
} from "../../../services/taxes/personasService"

export interface CreatePersonaData {
    access: string
    persona: CreateUpdatePersona
}

const useCreatePersona = (): UseMutationResult<Persona, Error, CreatePersonaData> => {
    const queryClient = useQueryClient()
    const service = getPersonasServiceSingle()

    return useMutation({
        mutationFn: (data: CreatePersonaData) =>
            service.post(data.persona, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-personas"] })
        },
    })
}

export default useCreatePersona
