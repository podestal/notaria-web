import { useQuery } from "@tanstack/react-query"
import { getSisgenSendJob } from "../../services/sisgen/sisgenSendJobService"

interface Props {
    jobId: number | null
    access: string
    enabled?: boolean
}

const useSisgenSendJob = ({ jobId, access, enabled = true }: Props) => {
    return useQuery({
        queryKey: ["sisgen-send-job", jobId],
        queryFn: () => getSisgenSendJob(jobId!, access),
        enabled: enabled && jobId != null && Boolean(access),
        refetchInterval: (query) => {
            const status = query.state.data?.status
            if (status === "completed" || status === "failed") return false
            return 2000
        },
        retry: false,
    })
}

export default useSisgenSendJob
