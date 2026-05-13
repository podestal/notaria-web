import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import type { Acto } from "../../../services/api/extraprotocolares/actoService"
import { getActoCreateClient } from "../../../services/api/extraprotocolares/actoService"

export interface CreateActoVariables {
    access: string
    acto: Acto
}

const useCreateActo = (): UseMutationResult<Acto, Error, CreateActoVariables> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ access, acto }: CreateActoVariables) => {
            const body: Partial<Acto> = { ...acto }
            if (!String(body.idtipoacto ?? "").trim()) {
                delete body.idtipoacto
            }
            return getActoCreateClient().post(body, access)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["actos page"] })
        },
    })
}

export default useCreateActo
