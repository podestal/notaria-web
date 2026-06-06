import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getCatalogServiceSingle,
    type Catalog,
    type CreateUpdateCatalog,
} from "../../services/taxes/catalogService"

export interface CreateCatalogData {
    access: string
    catalog: CreateUpdateCatalog
}

const useCreateCatalog = (): UseMutationResult<Catalog, Error, CreateCatalogData> => {
    const queryClient = useQueryClient()
    const service = getCatalogServiceSingle()

    return useMutation({
        mutationFn: (data: CreateCatalogData) =>
            service.post(data.catalog, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-catalog"] })
        },
    })
}

export default useCreateCatalog
