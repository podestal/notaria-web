import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getIngresoPoderesService, {IngresoPoderesPage} from "../../../../services/api/extraprotocolares/ingresoPoderes"
import moment from "moment"

interface Props {
    access: string
    page: number
    dateFrom?: Date
    dateTo?: Date
}

const useGetIngresoPoderes = ({ access, page, dateFrom, dateTo }: Props): UseQueryResult<IngresoPoderesPage, Error> => {

    const ingresoPoderesService = getIngresoPoderesService()
    let params: { page: string; dateFrom?: string; dateTo?: string } = { page: page.toString() }
    if (dateFrom) params = { ...params, dateFrom: moment(dateFrom).format('YYYY-MM-DD') }
    if (dateTo) params = { ...params, dateTo: moment(dateTo).format('YYYY-MM-DD') }

    return useQuery({
        queryKey: ['ingreso_poderes', page],
        queryFn: () => ingresoPoderesService.get(access, params),
        
    })
}

export default useGetIngresoPoderes