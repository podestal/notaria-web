import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getKardexService, { KardexPage } from "../../../services/api/kardexService"

interface Props {
    page: string
    idtipkar: number
    correlative?: string
    name?: string
    document?: string
    numescritura?: string
    access: string
}

const useGetKardexList = ({ page, idtipkar, correlative, name, document, numescritura, access }: Props): UseQueryResult<KardexPage, Error> => {
    let kardexService = getKardexService()

    let params: Record<string, string> = { page, idtipkar: idtipkar.toString() }

    if (correlative && correlative.length > 3) {
        params.correlative = correlative
    }
    if (name) {
        params.name = name
    }
    if (document) {
        params.document = document
    }
    
    if (numescritura) {
        params.numescritura = numescritura
    }

    return useQuery({
        queryKey: ['kardex list', page, idtipkar],
        queryFn: () => kardexService.get(access, params),
        refetchOnWindowFocus: false,
        
    })
}

export default useGetKardexList