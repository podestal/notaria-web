import useGetDocumentsByKardex from "../../../hooks/api/documents/useGetDocumentsByKardex"
import { Kardex } from "../../../services/api/kardexService"
import useAuthStore from "../../../store/useAuthStore"
import DigitacionDocumentCard from "./DigitacionDocumentCard"

interface Props {
    kardex: Kardex
}

const DigitacionTableBody = ({ kardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: documents, isLoading, isError, error, isSuccess } = useGetDocumentsByKardex({ access, kardex: kardex.kardex })

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {error.message}</div>

    if (isSuccess)

  return (
    <>
        {documents.length > 0 
        ? 
        <>
        {documents.map( document => (
            <DigitacionDocumentCard 
                key={document.id} 
                document={document} 
            />
        ))} 
        </>
        : 
        <div className="text-center text-gray-500 text-xs">No hay proyecto para este kardex</div>}
    </>
  )
}

export default DigitacionTableBody