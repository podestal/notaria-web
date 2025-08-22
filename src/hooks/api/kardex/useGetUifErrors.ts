import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { getKardexROService, KardexROPage } from "../../../services/api/kardexService"
import moment from "moment"

interface Props {
    dateFrom?: Date
    dateTo?: Date
    cronologico?: string
    access: string
    page: number
    listType?: string
}

const useGetUifErrors = ({ dateFrom, dateTo, cronologico, access, page, listType }: Props): UseQueryResult<KardexROPage, Error> => {
    
    const kardexROService = getKardexROService()

    let params: Record<string, string> = { page: page.toString() }

    if (dateFrom) {
        params.initialDate = moment(dateFrom).format('YYYY-MM-DD')
    }
    if (dateTo) {
        params.finalDate = moment(dateTo).format('YYYY-MM-DD')
    }

    if (cronologico) {
        params.cronologico = cronologico
    }

    if (listType) {
        params.listType = listType
    }
    

    return useQuery({
        queryKey: ['kardex-ro', page, listType],
        queryFn: () => kardexROService.get(access, params),
    })
}

export default useGetUifErrors