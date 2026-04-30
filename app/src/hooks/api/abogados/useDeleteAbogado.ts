import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { Abogado, getAbogadosServiceSingle } from "../../../services/api/abogadosService";

export interface DeleteAbogadoData {
    access: string;
}

interface Props {
    idabogado: string;
}

const useDeleteAbogado = ({ idabogado }: Props): UseMutationResult<Abogado, Error, DeleteAbogadoData> => {
    const queryClient = useQueryClient();
    const abogadoService = getAbogadosServiceSingle({ idabogado });

    return useMutation({
        mutationFn: (data: DeleteAbogadoData) => abogadoService.delete(data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["abogados"] });
        },
        onError: (error) => {
            console.error("Error deleting abogado:", error);
        },
    });
};

export default useDeleteAbogado;
