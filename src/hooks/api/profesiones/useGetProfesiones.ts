import { useQuery, UseQueryResult } from "@tanstack/react-query"
import profesionesService, {Profesion} from "../../../services/api/profesionesService"

const useGetProfesiones = (): UseQueryResult<Profesion[], Error> => {
  return useQuery({
    queryKey: ['profesiones'],
    queryFn: () => profesionesService.get(),
  })
}   

export default useGetProfesiones
