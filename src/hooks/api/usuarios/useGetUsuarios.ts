import { useQuery, UseQueryResult } from "@tanstack/react-query"
import usuariosService, { Usuario } from "../../../services/api/usuariosService"

const useGetUsuarios = (): UseQueryResult<Usuario[]> => {
    const usuarioService = usuariosService
    return useQuery({
        queryKey: ['usuarios'],
        queryFn: () => usuarioService.get(),
        refetchOnWindowFocus: false,
    })
}
export default useGetUsuarios