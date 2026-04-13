import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import { getLibrosServiceSingle, Libro, CreateUpdateLibro } from "../../../../services/api/extraprotocolares/librosService"

export interface CreateLibroData {
    access: string
    libro: CreateUpdateLibro
}

const useCreateLibro = (): UseMutationResult<Libro, Error, CreateLibroData> => {
    const queryClient = useQueryClient();
    const librosService = getLibrosServiceSingle({});

    return useMutation({
        mutationFn: (data: CreateLibroData) => librosService.post(data.libro, data.access),
        onSuccess: (res) => {
            console.log(res);
            queryClient.invalidateQueries({ queryKey: ['libros', 1] });
        },
        onError: (error) => {
            console.error(error);
        }
    })
}

export default useCreateLibro;