import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { Abogado, CreateUpdateAbogado, getAbogadosServiceSingle } from "../../../services/api/abogadosService";

export interface UpdateAbogadoData {
    access: string;
    abogado: CreateUpdateAbogado;
}

interface Props {
    idabogado: string;
}

const useUpdateAbogado = ({ idabogado }: Props): UseMutationResult<Abogado, Error, UpdateAbogadoData> => {
    const queryClient = useQueryClient();
    const abogadoService = getAbogadosServiceSingle({ idabogado });

    return useMutation({
        mutationFn: (data: UpdateAbogadoData) => abogadoService.update(data.abogado, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["abogados"] });
        },
        onError: (error) => {
            console.error("Error updating abogado:", error);
        },
    });
};

export default useUpdateAbogado;
