import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import type { ActoCondicion } from "../../../services/api/actoCondicionService"
import { getActoCondicionDetailClient } from "../../../services/api/actoCondicionService"

export interface DeleteActoCondicionVariables {
    access: string
    idcondicion: string
}

interface Props {
    idtipoacto: string
}

const useDeleteActoCondicion = ({
    idtipoacto,
}: Props): UseMutationResult<ActoCondicion, Error, DeleteActoCondicionVariables> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ access, idcondicion }: DeleteActoCondicionVariables) =>
            getActoCondicionDetailClient(idcondicion).delete(access),
        onSuccess: () => {
            const id = idtipoacto.trim()
            if (id) {
                queryClient.invalidateQueries({ queryKey: ["actocondicion", "by_tipoacto", id] })
            }
        },
    })
}

export default useDeleteActoCondicion
