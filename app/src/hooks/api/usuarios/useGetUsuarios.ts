import { useQuery, UseQueryResult } from "@tanstack/react-query"
import usuariosService, { Usuario } from "../../../services/api/usuariosService"

interface Props {
    access: string
  }

const useGetUsuarios = ({ access }: Props): UseQueryResult<Usuario[]> => {
    const usuarioService = usuariosService
    return useQuery({
        queryKey: ['usuarios'],
        queryFn: () => usuarioService.get(access),
        refetchOnWindowFocus: false,
    })
}
export default useGetUsuarios