import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { pdtRankingErroresClient, type PdtRankingPage } from "../../../../services/api/pdtMisErrores"

interface Props {
    access: string
    year: number
}

const useGetPdtRankingErrores = ({
    access,
    year,
}: Props): UseQueryResult<PdtRankingPage, Error> => {
    return useQuery({
        queryKey: ["pdt-ranking-errores", year],
        queryFn: () => pdtRankingErroresClient.get(access, { year: String(year) }),
        enabled: !!access && !!year,
    })
}

export default useGetPdtRankingErrores
