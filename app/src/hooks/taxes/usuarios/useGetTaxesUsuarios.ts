import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    taxesUsuariosService,
    type TaxesUsuario,
} from "../../../services/taxes/taxesUsuariosService"
import { normalizeTaxesList } from "../../../services/taxes/normalizeTaxesList"

interface Props {
    access: string
    enabled?: boolean
}

const useGetTaxesUsuarios = ({
    access,
    enabled = true,
}: Props): UseQueryResult<TaxesUsuario[], Error> => {
    return useQuery({
        queryKey: ["taxes-usuarios"],
        queryFn: async () =>
            normalizeTaxesList(await taxesUsuariosService.get(access)),
        enabled: enabled && !!access,
    })
}

export default useGetTaxesUsuarios
