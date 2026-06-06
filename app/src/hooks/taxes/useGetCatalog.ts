import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import catalogService, { type CatalogPage } from "../../services/taxes/catalogService"

interface Props {
    access: string
    page?: number
    codigo?: string
    descripcion?: string
    enabled?: boolean
}

const useGetCatalog = ({
    access,
    page = 1,
    codigo = "",
    descripcion = "",
    enabled = true,
}: Props): UseQueryResult<CatalogPage, Error> => {
    const params: Record<string, string> = {
        page: String(page),
    }
    if (codigo.trim()) params.codigo = codigo.trim()
    if (descripcion.trim()) params.descripcion = descripcion.trim()

    return useQuery({
        queryKey: ["taxes-catalog", page, codigo.trim(), descripcion.trim()],
        queryFn: () => catalogService.get(access, params),
        enabled: enabled && !!access,
    })
}

export default useGetCatalog
