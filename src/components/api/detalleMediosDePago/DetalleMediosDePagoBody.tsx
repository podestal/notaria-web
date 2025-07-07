import useGetDetalleMedioDePagoByPatrimonial from "../../../hooks/api/detalleMedioDePago/useGetDetalleMedioDePagoByPatrimonial"
import { Patrimonial } from "../../../services/api/patrimonialService"
import useAuthStore from "../../../store/useAuthStore"
import DetalleMediosDePagoCard from "./DetalleMediosDePagoCard"

interface Props {
    patrimonial: Patrimonial
}


const DetalleMediosDePagoBody = ({ patrimonial }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: detalleMediosDePago, isLoading, isError, error, isSuccess } = useGetDetalleMedioDePagoByPatrimonial({ access, itemmp: patrimonial.itemmp })

    if (isLoading) return <p className="text-center text-xs animate-pulse">Cargando...</p>

    if (isError) return <p className="text-center text-xs text-red-500">{error.message}</p>

    if (isSuccess && detalleMediosDePago.length === 0)  return <p className="text-center text-xs">No hay medios de pago registrados</p>

    if (isSuccess && detalleMediosDePago.length > 0) 

  return (
    <>
        {detalleMediosDePago.map(detalleMedioDePago => (
            <DetalleMediosDePagoCard 
                key={detalleMedioDePago.detmp}
                detalleMedioDePago={detalleMedioDePago}
                patrimonial={patrimonial}
            />
        ))}
    </>
  )
}

export default DetalleMediosDePagoBody