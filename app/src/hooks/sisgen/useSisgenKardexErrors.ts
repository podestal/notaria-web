import { useQuery } from "@tanstack/react-query"
import useAuthStore from "../../store/useAuthStore"
import {
    getSisgenKardexErrors,
    type SisgenKardexErrorsResponse,
} from "../../services/sisgen/sisgenKardexErrorsService"

interface Props {
    kardex: string
    enabled: boolean
}

const useSisgenKardexErrors = ({ kardex, enabled }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""

    return useQuery<SisgenKardexErrorsResponse, Error>({
        queryKey: ["sisgen-kardex-errors", kardex],
        enabled: enabled && !!kardex.trim() && !!access,
        queryFn: () => getSisgenKardexErrors(kardex, access),
        staleTime: 0,
    })
}

export default useSisgenKardexErrors
