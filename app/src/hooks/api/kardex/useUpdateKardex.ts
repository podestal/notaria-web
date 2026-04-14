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
        onSuccess: (updatedKardex) => {
            // Keep the currently open kardex in sync immediately (e.g. fktemplate in Digitacion tab).
            queryClient.setQueryData(['kardex', kardexId], updatedKardex);

            // Refresh single and list kardex queries regardless of page/filter.
            queryClient.invalidateQueries({ queryKey: ['kardex', kardexId] });
            queryClient.invalidateQueries({ queryKey: ['kardex list'] });

            // Refresh dependent data keyed by kardex code.
            queryClient.invalidateQueries({ queryKey: ["contratantes by kardex", updatedKardex.kardex] });
            queryClient.invalidateQueries({ queryKey: ["documents by kardex", `${updatedKardex.kardex}`] });
        },
        onError: (error) => {
            console.error("Error updating Kardex:", error);
        }
    });
};

export default useUpdateKardex;