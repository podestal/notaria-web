// import { useQuery, UseQueryResult } from "@tanstack/react-query"
// import getKardexService, { Kardex } from "../../../services/api/kardexService"

// const useGetKardex = (): UseQueryResult<Kardex[]> => {
//     const kardexService = getKardexService({ id })
//     return useQuery<Kardex[]>({
//         queryKey: ["kardex", id],
//         queryFn: () => kardexService.getAll(),
//         refetchOnWindowFocus: false,
//         retry: false,
//     })
// }