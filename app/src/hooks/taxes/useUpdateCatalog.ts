import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getCatalogServiceSingle,
    type Catalog,
    type CreateUpdateCatalog,
} from "../../services/taxes/catalogService"

export interface UpdateCatalogData {
    access: string
    catalog: CreateUpdateCatalog
}

interface Props {
    id_catalogo: number
}

const useUpdateCatalog = ({
    id_catalogo,
}: Props): UseMutationResult<Catalog, Error, UpdateCatalogData> => {
    const queryClient = useQueryClient()
    const service = getCatalogServiceSingle(id_catalogo)

    return useMutation({
        mutationFn: (data: UpdateCatalogData) =>
            service.update(data.catalog, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-catalog"] })
        },
    })
}

export default useUpdateCatalog
