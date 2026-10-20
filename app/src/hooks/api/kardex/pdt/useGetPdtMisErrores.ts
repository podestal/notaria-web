import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { pdtMisErroresClient, type PdtMisErroresPage } from "../../../../services/api/pdtMisErrores"

interface Props {
    access: string
    year: number
    usuario?: string
}

const useGetPdtMisErrores = ({
    access,
    year,
    usuario,
}: Props): UseQueryResult<PdtMisErroresPage, Error> => {
    const params: Record<string, string> = { year: String(year) }
    if (usuario) params.usuario = usuario

    return useQuery({
        queryKey: ["pdt-mis-errores", year, usuario || ""],
        queryFn: () => pdtMisErroresClient.get(access, params),
        enabled: !!access && !!year,
    })
}

export default useGetPdtMisErrores
