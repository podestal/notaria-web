import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getCliente2Service, {Cliente2} from "../../../services/api/clienteService"

interface Props {
    access: string
    idcontratante: string
}

const useGetCliente2ByContratante = ({ access, idcontratante }: Props): UseQueryResult<Cliente2, Error> => {

    const clienteService = getCliente2Service({ byContratante: true })
    const params = {
        idcontratante
    }

    return useQuery({
        queryKey: ['clientes2', idcontratante],
        queryFn: () => clienteService.get(access, params),
        enabled: !!idcontratante // Only run the query if idcontratante is provided
    })
}

export default useGetCliente2ByContratante