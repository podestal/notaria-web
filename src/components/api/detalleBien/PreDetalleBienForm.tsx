import useGetUbigeos from "../../../hooks/api/ubigeo/useGetUbigeos"
import { DetalleBien } from "../../../services/api/detalleBienService"
import DetalleBienForm from "./DetalleBienForm"

interface Props {
    detalleBien?: DetalleBien
}

const PreDetalleBienForm = ({ detalleBien }: Props) => {

    const { data: ubigeos, isLoading, isError, error, isSuccess } = useGetUbigeos()

    if (isLoading) return <p className="text-center animate-pulse my-4">Cargando...</p>

    if (isError) return <p className="text-center text-red-500 my-4">Error: {error.message}</p>

    if (isSuccess)

  return (
    <DetalleBienForm 
        ubigeos={ubigeos}
        detalleBien={detalleBien}
    />
  )
}

export default PreDetalleBienForm