import { useQuery, UseQueryResult } from "@tanstack/react-query"
import confinotarioService, { Confinotario } from "../../../services/api/confinotarioService"

interface Props {
  access: string
}

const useGetConfinotario = ({ access }: Props): UseQueryResult<Confinotario, Error> => {
  return useQuery({
    queryKey: ["confinotario"],
    queryFn: () => confinotarioService.get(access),
    refetchOnWindowFocus: false,
  })
}

export default useGetConfinotario
