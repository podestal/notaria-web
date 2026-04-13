import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getContratantesService, {Contratante} from "../../../services/api/contratantesService"

interface Props {
    kardex: string
}

const useGetContratantesByKardex = ({ kardex }: Props): UseQueryResult<Contratante[], Error> => {
    const contratantesService = getContratantesService({ byKardex: true })

    return useQuery({
        queryKey: ['contratantes by kardex', kardex],
        queryFn: () => contratantesService.get('', { kardex }),
        refetchOnWindowFocus: false,
    })
}

export default useGetContratantesByKardex