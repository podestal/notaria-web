import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getIngresoPoderesService, {IngresoPoderesPage} from "../../../../services/api/extraprotocolares/ingresoPoderes"
import moment from "moment"

interface Props {
    access: string
    page: number
    dateFrom?: Date
    dateTo?: Date
    dateType: string
}

const useGetIngresoPoderes = ({ access, page, dateFrom, dateTo, dateType }: Props): UseQueryResult<IngresoPoderesPage, Error> => {

    const ingresoPoderesService = getIngresoPoderesService()
    let params: { page: string; dateFrom?: string; dateTo?: string; dateType: string } = { page: page.toString(), dateType }
    if (dateFrom) params = { ...params, dateFrom: moment(dateFrom).format('YYYY-MM-DD') }
    if (dateTo) params = { ...params, dateTo: moment(dateTo).format('YYYY-MM-DD') }
    if (dateType === '2') {
        params = { ...params, dateType: 'fecha_crono' }
    } else {
        params = { ...params, dateType: 'fecha_ingreso' }
    }
    return useQuery({
        queryKey: ['ingreso_poderes', page],
        queryFn: () => ingresoPoderesService.get(access, params),
        
    })
}

export default useGetIngresoPoderes