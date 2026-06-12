import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import resumenesService, { type ResumenesPage } from "../../../services/taxes/resumenesService"

interface Props {
    access: string
    page?: number
    enabled?: boolean
}

const useGetResumenes = ({
    access,
    page = 1,
    enabled = true,
}: Props): UseQueryResult<ResumenesPage, Error> => {
    return useQuery({
        queryKey: ["taxes-resumenes", page],
        queryFn: () =>
            resumenesService.get(access, {
                page: String(page),
            }),
        enabled: enabled && !!access,
    })
}

export default useGetResumenes
