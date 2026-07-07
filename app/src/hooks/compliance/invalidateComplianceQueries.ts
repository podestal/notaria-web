import type { QueryClient } from "@tanstack/react-query"

export const invalidateComplianceQueries = (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: ["compliance"] })
