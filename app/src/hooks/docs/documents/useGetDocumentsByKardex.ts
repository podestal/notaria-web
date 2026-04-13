import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getDocumentService, { Documento} from "../../../services/docs/documentosService"

interface Props {
    access: string
    kardex: string
}

const useGetDocumentsByKardex = ({ access, kardex }: Props): UseQueryResult<Documento[], Error> => {
    const documentService = getDocumentService({ byKardex: true })
    const params = { kardex }
    
    return useQuery({
        queryKey: ['documents by kardex', kardex],
        queryFn: () => documentService.get(access, params),
        enabled: !!kardex,
    })
}

export default useGetDocumentsByKardex