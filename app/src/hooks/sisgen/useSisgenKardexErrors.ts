import { useQuery } from "@tanstack/react-query"
import {
    simulateSisgenKardexErrors,
    type SisgenKardexErrorsResponse,
} from "../../services/sisgen/sisgenKardexErrorsService"

interface Props {
    idkardex: number
    kardex: string
    enabled: boolean
}

/** Loads SISGEN errors for a kardex modal. Uses mock data until API is available. */
const useSisgenKardexErrors = ({ idkardex, kardex, enabled }: Props) => {
    return useQuery<SisgenKardexErrorsResponse, Error>({
        queryKey: ["sisgen-kardex-errors", idkardex],
        enabled: enabled && idkardex > 0,
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 350))
            return simulateSisgenKardexErrors(idkardex, kardex)
        },
        staleTime: 30_000,
    })
}

export default useSisgenKardexErrors
