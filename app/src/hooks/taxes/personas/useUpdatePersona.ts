import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getPersonasServiceSingle,
    type CreateUpdatePersona,
    type Persona,
} from "../../../services/taxes/personasService"

export interface UpdatePersonaData {
    access: string
    persona: CreateUpdatePersona
}

interface Props {
    id_persona: number
}

const useUpdatePersona = ({
    id_persona,
}: Props): UseMutationResult<Persona, Error, UpdatePersonaData> => {
    const queryClient = useQueryClient()
    const service = getPersonasServiceSingle(id_persona)

    return useMutation({
        mutationFn: (data: UpdatePersonaData) =>
            service.update(data.persona, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-personas"] })
        },
    })
}

export default useUpdatePersona
