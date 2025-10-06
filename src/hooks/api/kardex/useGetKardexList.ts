import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getKardexService, { KardexPage } from "../../../services/api/kardexService"
import moment from "moment"

interface Props {
    page: string
    idtipkar: number
    correlative?: string
    name?: string
    document?: string
    numescritura?: string
    indexReport?: string
    dateFrom?: Date;
    dateTo?: Date;
    access: string
}

const useGetKardexList = ({ 
    page, 
    idtipkar, 
    correlative, 
    name, 
    document, 
    numescritura, 
    indexReport, 
    access,
    dateFrom,
    dateTo
}: Props): UseQueryResult<KardexPage, Error> => {
    let kardexService = getKardexService()

    let params: Record<string, string> = { page, idtipkar: idtipkar.toString()}

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

    if (dateFrom) params = { ...params, dateFrom: moment(dateFrom).format('YYYY-MM-DD') }
    if (dateTo) params = { ...params, dateTo: moment(dateTo).format('YYYY-MM-DD') }

    console.log('indexReport', indexReport);
    

    if (indexReport) {
        params.indexReport = indexReport
    }

    return useQuery({
        queryKey: ['kardex list', page, idtipkar],
        queryFn: () => kardexService.get(access, params),
        refetchOnWindowFocus: false,
        
    })
}

export default useGetKardexList