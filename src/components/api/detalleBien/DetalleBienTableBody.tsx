import useGetDetalleBienesByKardex from "../../../hooks/api/detalleBien/useGetDetalleBienesByKardex"
import useAuthStore from "../../../store/useAuthStore"
import DetalleBienCard from "./DetalleBienCard"

interface Props {
  kardex: string
  idtipoacto: string
}

const DetalleBienTableBody = ({ kardex, idtipoacto }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: detalleBienes, isLoading, isError, error, isSuccess } = useGetDetalleBienesByKardex({ access, kardex })

    if (isLoading) return <p className="text-center text-xs my-6">Cargando...</p>

    if (isError) return <p className="text-center text-xs my-6">Error: {error.message}</p>

    if (isSuccess)

  return (
    <>{detalleBienes.length > 0 ? 
        detalleBienes
        .filter(detalle => detalle.idtipacto === idtipoacto)
        .map(detalle => (
            <DetalleBienCard key={detalle.detbien} detalleBien={detalle} />
    )) : <p className="text-center text-xs my-6">No hay detalles disponibles</p>}</>
  )
}

export default DetalleBienTableBody