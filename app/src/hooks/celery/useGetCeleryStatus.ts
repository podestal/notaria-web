import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    celeryStatusService,
    type CeleryStatusResponse,
} from "../../services/celery/celeryStatusService"

interface Props {
    access: string
    enabled?: boolean
}

const useGetCeleryStatus = ({
    access,
    enabled = true,
}: Props): UseQueryResult<CeleryStatusResponse, Error> => {
    return useQuery({
        queryKey: ["celery-status"],
        queryFn: () => celeryStatusService.get(access),
        enabled: enabled && !!access,
        refetchOnWindowFocus: false,
    })
}

export default useGetCeleryStatus
