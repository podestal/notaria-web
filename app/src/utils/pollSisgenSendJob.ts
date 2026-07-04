import { getSisgenSendJob, type SisgenSendJobResponse } from "../services/sisgen/sisgenSendJobService"

const POLL_INTERVAL_MS = 2000

export const pollSisgenSendJob = async (
    jobId: number,
    access: string,
    onUpdate?: (job: SisgenSendJobResponse) => void,
): Promise<SisgenSendJobResponse> => {
    while (true) {
        const job = await getSisgenSendJob(jobId, access)
        onUpdate?.(job)

        if (job.status === "completed" || job.status === "failed") {
            return job
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
    }
}
