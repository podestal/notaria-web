import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
    buildUifDateParams,
    fetchUifRegistro,
    uifTabToErrorsType,
    type UifRegistroPage,
} from "../../../services/uif/uifService"
import type { UifTabId } from "../../../services/uif/uifTypes"

interface Props {
    dateFrom?: Date
    dateTo?: Date
    access: string
    activeTab: UifTabId
    page: number
    enabled: boolean
    /** Bumped on each "Generar RO" so the same filters always trigger a fresh fetch */
    refreshKey: number
}

const useGetUifRegistro = ({
    dateFrom,
    dateTo,
    access,
    activeTab,
    page,
    enabled,
    refreshKey,
}: Props): UseQueryResult<UifRegistroPage, Error> => {
    const dates = buildUifDateParams(dateFrom, dateTo)
    const type = uifTabToErrorsType[activeTab]

    return useQuery({
        queryKey: ["uif-registro", dates?.initialDate, dates?.finalDate, type, page, refreshKey],
        queryFn: () => fetchUifRegistro(access, dateFrom!, dateTo!, type, page),
        enabled: enabled && !!dates,
        staleTime: 0,
    })
}

export default useGetUifRegistro
