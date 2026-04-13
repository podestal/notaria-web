import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import { CreateUpdateDomiciliario, Domiciliario, getDomiciliarioServiceSingle } from "../../../../services/api/extraprotocolares/domiciliarioService"

export interface CreateDomiciliarioData {
    access: string;
    domiciliario: CreateUpdateDomiciliario;
}

const useCreateDomiciliario = (): UseMutationResult<Domiciliario, Error, CreateDomiciliarioData> => {
    const queryClient = useQueryClient();
    const domiciliarioService = getDomiciliarioServiceSingle({})

    return useMutation({
        mutationFn: (data: CreateDomiciliarioData) => domiciliarioService.post(data.domiciliario, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['domiciliarios', 1] });
        },
        onError: (error) => {
            console.log(error);
        }
    })
}

export default useCreateDomiciliario;