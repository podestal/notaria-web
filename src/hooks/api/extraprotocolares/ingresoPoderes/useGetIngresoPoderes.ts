import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getIngresoPoderesService, {IngresoPoderesPage} from "../../../../services/api/extraprotocolares/ingresoPoderes"

interface Props {
    access: string
    page: number
}

const useGetIngresoPoderes = ({ access, page }: Props): UseQueryResult<IngresoPoderesPage, Error> => {

    const ingresoPoderesService = getIngresoPoderesService()
    const params = {
        page: page.toString(),
    }

    return useQuery({
        queryKey: ['ingreso_poderes', page],
        queryFn: () => ingresoPoderesService.get(access, params),
    })
}

export default useGetIngresoPoderes