import { useQuery, UseQueryResult } from "@tanstack/react-query"
import sedesRegistralesService, {SedeRegistral} from "../../../services/api/sedesRegistralesService"

interface Props {
    access: string
}

const useGetSedesRegistrales = ({ access }: Props): UseQueryResult<SedeRegistral[], Error> => {
    return useQuery({
        queryKey: ['sedes registrales'],
        queryFn: () => sedesRegistralesService.get(access),
    })
}
export default useGetSedesRegistrales