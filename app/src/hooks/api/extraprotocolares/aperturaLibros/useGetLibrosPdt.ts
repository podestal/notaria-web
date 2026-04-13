import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { getLibrosServiceSingle, LibroPdtPage } from "../../../../services/api/extraprotocolares/librosService"
import moment from "moment"

interface Props {
    access: string;
    page: number;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
}

const useGetLibrosPdt = ({ access, page, dateFrom, dateTo }: Props): UseQueryResult<LibroPdtPage, Error> => {

    const librosService = getLibrosServiceSingle({ libroPdt: true })
    const params: Record<string, string> = {
        page: page.toString(),
        initialDate: dateFrom ? moment(dateFrom).format('DD/MM/YYYY') : '',
        finalDate: dateTo ? moment(dateTo).format('DD/MM/YYYY') : '',
    }
    return useQuery({
        queryKey: ['librosPdt', page],
        queryFn: () => librosService.get(access, params),
        enabled: !!dateFrom && !!dateTo
    })
}

export default useGetLibrosPdt
