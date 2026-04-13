import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { getLibrosServiceSingle, Libro } from "../../../../services/api/extraprotocolares/librosService"

interface Props {
    access: string
    numlibro: string
}

const useGetLibroByNumlibro = ({ access, numlibro }: Props): UseQueryResult<Libro, Error> => {
    const libroService = getLibrosServiceSingle({ byNumlibro: true })
    const params: Record<string, string> = {
        numlibro,
    }
    return useQuery({
        queryKey: ['libro', numlibro],
        queryFn: () => libroService.get(access, params),
    })
}

export default useGetLibroByNumlibro
