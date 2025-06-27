import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getDocumentService, { Document } from "../../../services/api/documentsService"

interface Props {
    access: string
    kardex: string
}

const useGetDocumentsByKardex = ({ access, kardex }: Props): UseQueryResult<Document[], Error> => {
    const documentService = getDocumentService({ byKardex: true })
    const params = { kardex }
    
    return useQuery({
        queryKey: ['documents by kardex', kardex],
        queryFn: () => documentService.get(access, params),
        enabled: !!kardex,
    })
}

export default useGetDocumentsByKardex