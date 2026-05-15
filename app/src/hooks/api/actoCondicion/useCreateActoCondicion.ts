import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import type { ActoCondicion, CreateActoCondicionPayload } from "../../../services/api/actoCondicionService"
import { getActoCondicionWriteClient } from "../../../services/api/actoCondicionService"

export interface CreateActoCondicionVariables {
    access: string
    body: CreateActoCondicionPayload
}

const useCreateActoCondicion = (): UseMutationResult<ActoCondicion, Error, CreateActoCondicionVariables> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ access, body }: CreateActoCondicionVariables) =>
            getActoCondicionWriteClient().post(body, access),
        onSuccess: (_data, variables) => {
            const id = variables.body.idtipoacto?.trim()
            if (id) {
                queryClient.invalidateQueries({ queryKey: ["actocondicion", "by_tipoacto", id] })
            }
        },
    })
}

export default useCreateActoCondicion
