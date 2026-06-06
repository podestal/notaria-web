import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    codigosUnitariosService,
    type CodigosUnitarios,
} from "../../services/taxes/codigosUnitariosService"
import { normalizeTaxesList } from "../../services/taxes/normalizeTaxesList"

interface Props {
    access: string
    enabled?: boolean
}

const useGetCodigosUnitarios = ({
    access,
    enabled = true,
}: Props): UseQueryResult<CodigosUnitarios[], Error> => {
    return useQuery({
        queryKey: ["taxes-codigos-unitarios"],
        queryFn: async () =>
            normalizeTaxesList(await codigosUnitariosService.get(access)),
        enabled: enabled && !!access,
    })
}

export default useGetCodigosUnitarios
