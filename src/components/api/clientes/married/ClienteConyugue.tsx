import useRetrieveClient from "../../../../hooks/api/cliente/useRetrieveClient"
import useAuthStore from "../../../../store/useAuthStore"

interface Props {
    clienteId: string
}

const ClienteConyugue = ({ clienteId }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: cliente, isLoading, isError, error, isSuccess} = useRetrieveClient({ access, id: clienteId })

    if (isLoading) return <p className="text-center text-xs text-gray-500 animate-pulse my-2">Cargando...</p>
    if (isError) return <p className="text-center text-xs text-red-500 my-2">Error: {error.message}</p>
    if (isSuccess) 

  return (
    <div>
        <p>Casado con: {cliente?.nombre}</p>
    </div>
  )
}

export default ClienteConyugue