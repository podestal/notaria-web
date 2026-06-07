import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    documentosService,
    type Documento,
} from "../../../services/taxes/documentosService"
import { normalizeTaxesList } from "../../../services/taxes/normalizeTaxesList"

interface Props {
    access: string
    enabled?: boolean
}

const useGetDocumentos = ({
    access,
    enabled = true,
}: Props): UseQueryResult<Documento[], Error> => {
    return useQuery({
        queryKey: ["taxes-documentos"],
        queryFn: async () =>
            normalizeTaxesList(await documentosService.get(access)),
        enabled: enabled && !!access,
    })
}

export default useGetDocumentos
