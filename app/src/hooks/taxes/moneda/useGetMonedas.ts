import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { monedaService, type Moneda } from "../../../services/taxes/monedaService"
import { normalizeTaxesList } from "../../../services/taxes/normalizeTaxesList"

interface Props {
    access: string
    enabled?: boolean
}

const useGetMonedas = ({
    access,
    enabled = true,
}: Props): UseQueryResult<Moneda[], Error> => {
    return useQuery({
        queryKey: ["taxes-monedas"],
        queryFn: async () => normalizeTaxesList(await monedaService.get(access)),
        enabled: enabled && !!access,
    })
}

export default useGetMonedas
