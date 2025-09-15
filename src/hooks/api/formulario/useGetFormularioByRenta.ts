import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getFormularioService, { Formulario } from "../../../services/api/formularioService"

interface Props {
    access: string
    idrenta: string
}

const useGetFormularioByRenta = ({ access, idrenta }: Props): UseQueryResult<Formulario[], Error> => {
    const formularioService = getFormularioService({ byRenta: true })
    const params: Record<string, string> = {
        idrenta
    }
    return useQuery({
        queryKey: ['formulario', idrenta],
        queryFn: () => formularioService.get(access, params),
    })
}

export default useGetFormularioByRenta