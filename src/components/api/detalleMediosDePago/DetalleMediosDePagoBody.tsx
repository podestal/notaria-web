import useGetDetalleMedioDePagoByPatrimonial from "../../../hooks/api/detalleMedioDePago/useGetDetalleMedioDePagoByPatrimonial"
import useAuthStore from "../../../store/useAuthStore"
import DetalleMediosDePagoCard from "./DetalleMediosDePagoCard"

interface Props {
    itemmp: string
}


const DetalleMediosDePagoBody = ({ itemmp }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: detalleMediosDePago, isLoading, isError, error, isSuccess } = useGetDetalleMedioDePagoByPatrimonial({ access, itemmp })

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
            />
        ))}
    </>
  )
}

export default DetalleMediosDePagoBody