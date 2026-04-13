import { useQuery, UseQueryResult } from "@tanstack/react-query"
import tipoLibroService, { TipoLibro } from "../../../../services/api/extraprotocolares/tipoLibroService"

interface Props {
    access: string
}

const useGetTipoLibros = ({ access }: Props): UseQueryResult<TipoLibro[], Error> => {
    return useQuery({
        queryKey: ['tipo-libro'],
        queryFn: () => tipoLibroService.get(access)
    })
}

export default useGetTipoLibros