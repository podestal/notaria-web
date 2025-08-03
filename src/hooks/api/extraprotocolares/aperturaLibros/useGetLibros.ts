import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getLibrosService, {LibrosPage} from "../../../../services/api/extraprotocolares/librosService"

interface Props {
    access: string
    page: number
}

const useGetLibros = ({ access, page }: Props): UseQueryResult<LibrosPage, Error> => {
    const librosService = getLibrosService();

    return useQuery({
        queryKey: ['libros', page],
        queryFn: () => librosService.get(access, { page: page.toString() }),
    });
}

export default useGetLibros;