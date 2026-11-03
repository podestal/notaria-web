import type { QueryClient } from "@tanstack/react-query"

export const invalidateComplianceQueries = (queryClient: QueryClient) => {
    void queryClient.invalidateQueries({ queryKey: ["compliance"] })
    void queryClient.invalidateQueries({ queryKey: ["pdt-mis-errores"] })
}
