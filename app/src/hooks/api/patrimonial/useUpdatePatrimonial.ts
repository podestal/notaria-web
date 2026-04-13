import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getPatrimonialService, { Patrimonial, PatrimonialCreateUpdate } from "../../../services/api/patrimonialService"

export interface UpdatePatrimonialData {
    patrimonial: PatrimonialCreateUpdate;
    access: string;
}

interface Props {
    idPatrimonial: string;
}

const useUpdatePatrimonial = ({ idPatrimonial }: Props): UseMutationResult<Patrimonial, Error, UpdatePatrimonialData> => {
    const queryClient = useQueryClient();
    const patrimonialService = getPatrimonialService({ idPatrimonial });

    return useMutation({
        mutationFn: (data: UpdatePatrimonialData) => patrimonialService.update(data.patrimonial, data.access),
        onSuccess: (data) => {
            console.log('data res', data);
            queryClient.invalidateQueries({ queryKey: ['patrimonial by kardex', data.kardex] });
        },
        onError: (error) => {
            console.error("Error updating Patrimonial:", error);
        }
    });
};

export default useUpdatePatrimonial;