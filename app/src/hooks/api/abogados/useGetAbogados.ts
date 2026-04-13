import { useQuery, UseQueryResult } from "@tanstack/react-query"
import abogadosService, { Abogado } from "../../../services/api/abogadosService"

interface Props {
  access: string
}


const useGetAbogados = ({ access }: Props): UseQueryResult<Abogado[]> => {
  return useQuery({
    queryKey: ['abogados'],
    queryFn: () => abogadosService.get(access),
  })
}

export default useGetAbogados