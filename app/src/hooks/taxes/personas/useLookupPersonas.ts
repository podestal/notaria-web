import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    normalizePersonasLookupResults,
    personasLookupService,
    type Persona,
} from "../../../services/taxes/personasService"

interface Props {
    access: string
    q?: string
    enabled?: boolean
}

const useLookupPersonas = ({
    access,
    q = "",
    enabled = true,
}: Props): UseQueryResult<Persona[], Error> => {
    const trimmed = q.trim()

    return useQuery({
        queryKey: ["taxes-personas-lookup", trimmed],
        queryFn: async () => {
            const data = await personasLookupService.get(access, { q: trimmed })
            return normalizePersonasLookupResults(data)
        },
        enabled: enabled && !!access && trimmed.length > 0,
    })
}

export default useLookupPersonas
