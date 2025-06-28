import useGetDocumentsByKardex from "../../../hooks/api/documents/useGetDocumentsByKardex"
import { Kardex } from "../../../services/api/kardexService"
import useAuthStore from "../../../store/useAuthStore"

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
            <div
                key={document.id}
                className="grid grid-cols-14 text-xs text-black px-2 my-2 place-content-center border-b-2 border-gray-200"
            >
                <p>{document.id}</p>
            </div>
        ))} 
        </>
        : 
        <div className="text-center text-gray-500">No hay proyecto para este kardex</div>}
    </>
  )
}

export default DigitacionTableBody