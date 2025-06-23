import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import getPatrimonialService, {Patrimonial} from "../../../services/api/patrimonialService"

interface RemovePatrimonialData {
    access: string
}

interface Props {
    idPatrimonial: string
    kardex: string
}

const useRemovePatrimonial = ({ idPatrimonial, kardex }: Props): UseMutationResult<Patrimonial, Error, RemovePatrimonialData> => {
    const queryClient = useQueryClient();
    const patrimonialService = getPatrimonialService({ idPatrimonial });

    return useMutation({
        mutationFn: (data: RemovePatrimonialData) => patrimonialService.delete(data.access),
        onSuccess: (data) => {
            console.log('data res', data);
            queryClient.invalidateQueries({ queryKey: ['patrimonial by kardex', kardex] });
        },
        onError: (error) => {
            console.error("Error removing Patrimonial:", error);
        }
    });
};

export default useRemovePatrimonial;