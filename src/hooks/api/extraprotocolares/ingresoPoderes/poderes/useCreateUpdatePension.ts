import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getPoderPensionService, { CreateUpdatePoderPension, PoderPension } from "../../../../../services/api/extraprotocolares/poderPension"

interface CreateUpdatePoderPensionData {
    poderPension: CreateUpdatePoderPension
    access: string
}

interface Props {
    idPoderPension?: number;
    poderId: number;
}

const useCreateUpdatePension = ({ idPoderPension, poderId }: Props): UseMutationResult<PoderPension, Error, CreateUpdatePoderPensionData> => {
    const queryClient = useQueryClient()
    const poderPensionService = idPoderPension ? getPoderPensionService({ idPoderPension }) : getPoderPensionService({})
    return useMutation({
        mutationFn: (data: CreateUpdatePoderPensionData) => {
            if (idPoderPension) {
                return poderPensionService.update(data.poderPension, data.access)
            } else {
                return poderPensionService.post(data.poderPension, data.access)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['poder-pension', poderId] })
        },
        onError: (error) => {
            console.log(error)
        }
    })
}

export default useCreateUpdatePension