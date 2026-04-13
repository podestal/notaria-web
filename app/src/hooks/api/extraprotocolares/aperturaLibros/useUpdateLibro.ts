import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import { getLibrosServiceSingle, Libro, CreateUpdateLibro } from "../../../../services/api/extraprotocolares/librosService"

export interface UpdateLibroData {
    access: string;
    libro: CreateUpdateLibro
}

interface Props {
    libroId: number;
    page: number;
}

const useUpdateLibro = ({ libroId, page }: Props): UseMutationResult<Libro, Error, UpdateLibroData> => {
    const queryClient = useQueryClient();
    const librosService = getLibrosServiceSingle({ libroId });

    return useMutation({
        mutationFn: (data: UpdateLibroData) => librosService.update(data.libro, data.access),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['libros', page] });
        },
        onError: (error) => {
            console.error(error);
        }
    })
}

export default useUpdateLibro;