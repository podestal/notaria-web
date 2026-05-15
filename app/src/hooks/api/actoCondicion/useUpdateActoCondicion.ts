import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import type { ActoCondicion, UpdateActoCondicionPayload } from "../../../services/api/actoCondicionService"
import { getActoCondicionDetailClient } from "../../../services/api/actoCondicionService"

export interface UpdateActoCondicionVariables {
    access: string
    idcondicion: string
    body: UpdateActoCondicionPayload
}

interface Props {
    idtipoacto: string
}

const useUpdateActoCondicion = ({
    idtipoacto,
}: Props): UseMutationResult<ActoCondicion, Error, UpdateActoCondicionVariables> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ access, idcondicion, body }: UpdateActoCondicionVariables) =>
            getActoCondicionDetailClient(idcondicion).update(body, access),
        onSuccess: () => {
            const id = idtipoacto.trim()
            if (id) {
                queryClient.invalidateQueries({ queryKey: ["actocondicion", "by_tipoacto", id] })
            }
        },
    })
}

export default useUpdateActoCondicion
