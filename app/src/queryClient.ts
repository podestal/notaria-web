import { QueryClient } from "@tanstack/react-query"
import { invalidateComplianceQueries } from "./hooks/compliance/invalidateComplianceQueries"

export const queryClient = new QueryClient()

let progressRefreshTimer: ReturnType<typeof setTimeout> | undefined

const scheduleKardexProgressRefresh = () => {
    const watching = queryClient.getQueryCache().findAll({
        queryKey: ["compliance", "kardex"],
        type: "active",
    }).length > 0
    if (!watching) return
    clearTimeout(progressRefreshTimer)
    progressRefreshTimer = setTimeout(() => {
        void invalidateComplianceQueries(queryClient)
    }, 200)
}

queryClient.getMutationCache().subscribe((event) => {
    if (event.type !== "updated" || event.action.type !== "success") return
    scheduleKardexProgressRefresh()
})
