import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getContratantesService, {Contratante} from "../../../services/api/contratantesService"
import useAuthStore from "../../../store/useAuthStore"

interface Props {
    kardex: string
}

const useGetContratantesByKardex = ({ kardex }: Props): UseQueryResult<Contratante[], Error> => {
    const access = useAuthStore((s) => s.access_token) || ""
    const contratantesService = getContratantesService({ byKardex: true })

    return useQuery({
        queryKey: ['contratantes by kardex', kardex, access],
        queryFn: () => contratantesService.get(access, { kardex }),
        enabled: Boolean(access && kardex),
        refetchOnWindowFocus: false,
    })
}

export default useGetContratantesByKardex