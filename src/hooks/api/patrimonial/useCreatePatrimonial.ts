import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getPatrimonialService, { Patrimonial, PatrimonialCreateUpdate } from "../../../services/api/patrimonialService"

export interface CreatePatrimonialData {
    patrimonial: PatrimonialCreateUpdate
    access: string
}

interface Props {
    kardex: string
}

const useCreatePatrimonial = ({ kardex }: Props): UseMutationResult<Patrimonial, Error, CreatePatrimonialData> => {
    const queryClient = useQueryClient()
    const patrimonialService = getPatrimonialService({  })

    return useMutation({
        mutationFn: ({ patrimonial, access }) => patrimonialService.post(patrimonial, access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patrimonial by kardex', kardex] })
        },
    })
}

export default useCreatePatrimonial