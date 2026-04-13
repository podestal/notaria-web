import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getLegalizacionService, {LegalizacionPage} from "../../../../services/api/extraprotocolares/legalizacionService"
import moment from "moment"

interface Props {
    access: string
    page: number
    dateFrom?: Date
    dateTo?: Date
}

const useGetLegalizaciones = ({ access, page, dateFrom, dateTo }: Props): UseQueryResult<LegalizacionPage, Error> => {
    const legalizacionService = getLegalizacionService()
    console.log('dateFrom', dateFrom);
    console.log('dateTo', dateTo);

    let params: { page: string; dateFrom?: string; dateTo?: string } = { page: page.toString() }
    if (dateFrom) params = { ...params, dateFrom: moment(dateFrom).format('YYYY-MM-DD') }
    if (dateTo) params = { ...params, dateTo: moment(dateTo).format('YYYY-MM-DD') }

    return useQuery({
        queryKey: ['legalizaciones', params],
        queryFn: () => legalizacionService.get(access, params),
    })
}

export default useGetLegalizaciones