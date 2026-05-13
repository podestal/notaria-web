import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import type { Acto } from "../../../services/api/extraprotocolares/actoService"
import { getActoDetailClient } from "../../../services/api/extraprotocolares/actoService"

export interface UpdateActoVariables {
    access: string
    /** Id original en URL (no cambia aunque el formulario muestre el mismo valor bloqueado). */
    idtipoactoUrl: string
    payload: Partial<Acto>
}

const useUpdateActo = (): UseMutationResult<Acto, Error, UpdateActoVariables> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ access, idtipoactoUrl, payload }: UpdateActoVariables) =>
            getActoDetailClient(idtipoactoUrl).update(payload, access),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["actos page"] })
            const id = variables.idtipoactoUrl.trim()
            if (id) {
                queryClient.invalidateQueries({ queryKey: ["actocondicion", "by_tipoacto", id] })
            }
        },
    })
}

export default useUpdateActo
