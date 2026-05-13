import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import getTipokardexService, { type Tipokardex } from "../../../services/api/tipokardexService"

/** API may return an array, null, or a paginated envelope — always normalize to an array. */
function normalizeTipokardexList(raw: unknown): Tipokardex[] {
    if (raw == null) return []
    if (Array.isArray(raw)) return raw
    if (typeof raw === "object" && raw !== null && "results" in raw) {
        const r = (raw as { results?: unknown }).results
        return Array.isArray(r) ? (r as Tipokardex[]) : []
    }
    return []
}

const useGetTipoKardexList = (): UseQueryResult<Tipokardex[], Error> => {
    const tipoKardexService = getTipokardexService()

    return useQuery({
        queryKey: ["tipoKardex list"],
        queryFn: () => tipoKardexService.get(),
        select: (data) => normalizeTipokardexList(data),
    })
}

export default useGetTipoKardexList
