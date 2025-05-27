import { useQuery, UseQueryResult } from "@tanstack/react-query"
import abogadosService, { Abogado } from "../../../services/api/abogadosService"

const useGetAbogados = (): UseQueryResult<Abogado[]> => {
  return useQuery({
    queryKey: ['abogados'],
    queryFn: () => abogadosService.get(),
  })
}

export default useGetAbogados