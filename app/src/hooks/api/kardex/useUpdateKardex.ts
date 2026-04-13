import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUpdateKardex, Kardex, getSingleKardexService } from "../../../services/api/kardexService";

export interface UpdateKardexData {
    kardex: CreateUpdateKardex;
    access: string;
}

interface Props {
    kardexId: number;

}

const useUpdateKardex = ({ kardexId }: Props): UseMutationResult<Kardex, Error, UpdateKardexData> => {
    const queryClient = useQueryClient();
    const kardexService = getSingleKardexService({ id: kardexId })

    return useMutation({
        mutationFn: (data: UpdateKardexData) => kardexService.update(data.kardex, data.access),
        onSuccess: (data) => {
            console.log('data res', data);
            queryClient.invalidateQueries({ queryKey: ['kardex', kardexId] });
            queryClient.invalidateQueries({ queryKey: ["contratantes by kardex",data.kardex] })
            queryClient.invalidateQueries({ queryKey: ['kardex list', "1", data?.idtipkar] })
            
            // queryClient.invalidateQueries({ queryKey: ['kardex'] });
            // queryClient.invalidateQueries({ queryKey: ['kardex', data.idkardex] });
        },
        onError: (error) => {
            console.error("Error updating Kardex:", error);
        }
    });
};

export default useUpdateKardex;