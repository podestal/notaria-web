import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getPdtKardexErrorsService, { PdtPage } from "../../../../services/api/pdtKardexErrors"
import moment from "moment"

interface Props {
    access: string
    page: number
    dateFrom: Date | undefined
    dateTo: Date | undefined
}

const useGetGarantiasPdt = ({ access, page, dateFrom, dateTo }: Props): UseQueryResult<PdtPage, Error> => {
    const pdtKardexErrorsService = getPdtKardexErrorsService({ forGarantias: true })
    const params: Record<string, string> = {
        page: page.toString(),
        initialDate: dateFrom ? moment(dateFrom).format('DD/MM/YYYY') : '',
        finalDate: dateTo ? moment(dateTo).format('DD/MM/YYYY') : '',
    }
    return useQuery({
        queryKey: ['garantias-pdt', page, dateFrom, dateTo],
        queryFn: () => pdtKardexErrorsService.get(access, params),
        enabled: !!dateFrom && !!dateTo
    })
}

export default useGetGarantiasPdt