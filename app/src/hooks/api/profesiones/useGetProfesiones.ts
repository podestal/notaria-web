import { useQuery, UseQueryResult } from "@tanstack/react-query"
import profesionesService, {Profesion} from "../../../services/api/profesionesService"

interface Props {
  access: string
}

const useGetProfesiones = ({ access }: Props): UseQueryResult<Profesion[], Error> => {
  return useQuery({
    queryKey: ['profesiones'],
    queryFn: () => profesionesService.get(access),
  })
}   

export default useGetProfesiones
