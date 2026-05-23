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
}

const useGetUifRegistro = ({
    dateFrom,
    dateTo,
    access,
    activeTab,
    page,
    enabled,
}: Props): UseQueryResult<UifRegistroPage, Error> => {
    const dates = buildUifDateParams(dateFrom, dateTo)
    const type = uifTabToErrorsType[activeTab]

    return useQuery({
        queryKey: ["uif-registro", dates?.initialDate, dates?.finalDate, type, page],
        queryFn: () => fetchUifRegistro(access, dateFrom!, dateTo!, type, page),
        enabled: enabled && !!dates,
    })
}

export default useGetUifRegistro
