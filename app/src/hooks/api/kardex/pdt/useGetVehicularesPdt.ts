import { useQuery, UseQueryResult } from '@tanstack/react-query'
import getPdtKardexErrorsService, { PdtPage } from '../../../../services/api/pdtKardexErrors'
import moment from 'moment'

interface Props {
    access: string
    page: number
    dateFrom: Date | undefined
    dateTo: Date | undefined
}

const useGetVehicularesPdt = ({ access, page, dateFrom, dateTo }: Props): UseQueryResult<PdtPage, Error> => {

    const pdtKardexErrorsService = getPdtKardexErrorsService({ forVehicular: true })
    const params: Record<string, string> = {
        page: page.toString(),
        initialDate: dateFrom ? moment(dateFrom).format('DD/MM/YYYY') : '',
        finalDate: dateTo ? moment(dateTo).format('DD/MM/YYYY') : '',
    }

    return useQuery<PdtPage, Error>({
        queryKey: ['vehiculares-pdt', page, dateFrom, dateTo],
        queryFn: () => pdtKardexErrorsService.get(access, params),
        enabled: !!dateFrom && !!dateTo
    })
}

export default useGetVehicularesPdt
