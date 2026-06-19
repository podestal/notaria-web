import { useQuery, UseQueryResult } from "@tanstack/react-query"
import axios from "axios"
import getContratantesService, { Contratante } from "../../../services/api/contratantesService"
import useAuthStore from "../../../store/useAuthStore"

interface Props {
    kardex: string
}

const fetchContratantesByKardex = async (
    access: string,
    kardex: string,
): Promise<Contratante[]> => {
    const contratantesService = getContratantesService({ byKardex: true })

    try {
        const data = await contratantesService.get(access, { kardex })
        return Array.isArray(data) ? data : []
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return []
        }
        throw error
    }
}

const useGetContratantesByKardex = ({ kardex }: Props): UseQueryResult<Contratante[], Error> => {
    const access = useAuthStore((s) => s.access_token) || ""

    return useQuery({
        queryKey: ["contratantes by kardex", kardex, access],
        queryFn: () => fetchContratantesByKardex(access, kardex),
        enabled: Boolean(access && kardex),
        refetchOnWindowFocus: false,
    })
}

export default useGetContratantesByKardex
