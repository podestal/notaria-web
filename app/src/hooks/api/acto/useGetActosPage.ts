import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getActoService, type ActoPage } from "../../../services/api/extraprotocolares/actoService"

interface Props {
    access: string
    desacto: string
    idtipoacto: string
    /** Empty string = no filter */
    idtipkar: string
    page: number
}

const buildParams = ({ desacto, idtipoacto, idtipkar, page }: Omit<Props, "access">): Record<string, string> => {
    const params: Record<string, string> = { page: page.toString() }
    const d = desacto.trim()
    if (d) params.desacto = d
    const ta = idtipoacto.trim()
    if (ta) params.idtipoacto = ta
    const tk = idtipkar.trim()
    if (tk) params.idtipkar = tk
    return params
}

const useGetActosPage = ({
    access,
    desacto,
    idtipoacto,
    idtipkar,
    page,
}: Props): UseQueryResult<ActoPage, Error> => {
    const actoService = getActoService()
    const params = buildParams({ desacto, idtipoacto, idtipkar, page })
    return useQuery({
        queryKey: ["actos page", desacto, idtipoacto, idtipkar, page],
        queryFn: () => actoService.get(access, params),
        enabled: Boolean(access),
    })
}

export default useGetActosPage
