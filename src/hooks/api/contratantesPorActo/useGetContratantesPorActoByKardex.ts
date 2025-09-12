import { useQuery, UseBaseQueryResult } from "@tanstack/react-query"
import getContratantesPorActoService, { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"

interface Props {
    access: string
    kardex: string
}

const useGetContratantesPorActoByKardex = ({ access, kardex }: Props): UseBaseQueryResult<ContratantesPorActo[], Error> => {

    const contratantesPorActoService = getContratantesPorActoService({ byKardex: true })
    const params: Record<string, string> = { kardex }
    return useQuery({
        queryKey: ['contratantesPorActoByKardex', kardex],
        queryFn: () => contratantesPorActoService.get(access, params),
    })
}

export default useGetContratantesPorActoByKardex