import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { Abogado, CreateUpdateAbogado, getAbogadosServiceSingle } from "../../../services/api/abogadosService";

export interface CreateAbogadoData {
    access: string;
    abogado: CreateUpdateAbogado;
}

const useCreateAbogado = (): UseMutationResult<Abogado, Error, CreateAbogadoData> => {
    const queryClient = useQueryClient();
    const abogadoService = getAbogadosServiceSingle({});

    return useMutation({
        mutationFn: (data: CreateAbogadoData) => abogadoService.post(data.abogado, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["abogados"] });
        },
        onError: (error) => {
            console.error("Error creating abogado:", error);
        },
    });
};

export default useCreateAbogado;
