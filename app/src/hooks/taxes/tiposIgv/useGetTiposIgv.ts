import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { tiposIgvService, type TipoIgv } from "../../../services/taxes/tiposIgvService"
import { normalizeTaxesList } from "../../../services/taxes/normalizeTaxesList"

interface Props {
    access: string
    enabled?: boolean
}

const useGetTiposIgv = ({
    access,
    enabled = true,
}: Props): UseQueryResult<TipoIgv[], Error> => {
    return useQuery({
        queryKey: ["taxes-tipos-igv"],
        queryFn: async () => normalizeTaxesList(await tiposIgvService.get(access)),
        enabled: enabled && !!access,
    })
}

export default useGetTiposIgv
