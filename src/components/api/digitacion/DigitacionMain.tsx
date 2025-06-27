import useGetDocumentsByKardex from "../../../hooks/api/documents/useGetDocumentsByKardex"
import { Kardex } from "../../../services/api/kardexService"
import useAuthStore from "../../../store/useAuthStore"

interface Props {
    kardex: Kardex
}

const DigitacionMain = ({ kardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: documents, isLoading, isError, error, isSuccess } = useGetDocumentsByKardex({ access, kardex: kardex.kardex })

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {error.message}</div>

    if (isSuccess)

  return (
    <div>
        <>{console.log('documents', documents)}</>
        <p>DigitacionMain</p>
    </div>
  )
}

export default DigitacionMain