import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import { CreateUpdateDomiciliario, getDomiciliarioServiceSingle, Domiciliario } from "../../../../services/api/extraprotocolares/domiciliarioService"

export interface UpdateDomiciliarioData {
    access: string;
    domiciliario: CreateUpdateDomiciliario;
}

interface Props {
    domiciliarioId: number;
    page: number;
}

const useUpdateDomiciliario = ({ domiciliarioId, page }: Props): UseMutationResult<Domiciliario, Error, UpdateDomiciliarioData> => {
    const queryClient = useQueryClient();
    const domiciliarioService = getDomiciliarioServiceSingle({ domiciliarioId })
    return useMutation({
        mutationFn: (data: UpdateDomiciliarioData) => domiciliarioService.update(data.domiciliario, data.access),
        onSuccess: res => {
            console.log(res);
            queryClient.invalidateQueries({ queryKey: ['domiciliarios', page] });
        },
        onError: (error) => {
            console.log(error);
        }
    })
}

export default useUpdateDomiciliario;