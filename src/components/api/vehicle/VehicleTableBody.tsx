import useGetVehicularesByKardex from "../../../hooks/api/vehiculares/useGetVehicularesByKardex"
import useAuthStore from "../../../store/useAuthStore"

interface Props {
    kardex: string
}

const VehicleTableBody = ({ kardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: vehicles, isLoading, isError, error, isSuccess } = useGetVehicularesByKardex({ access, kardex })

    if (isLoading) return <p className="text-md animate-pulse text-center my-2">Cargando ...</p>
    if (isError) return <p className="text-md text-red-500 text-center">Error: {error.message}</p>
    if (isSuccess && vehicles.length === 0) return <p className="text-md text-center my-2">No hay datos vehiculares</p>
    if (isSuccess && vehicles.length > 0) 

  return (
    <div className="grid grid-cols-7">
        <>{console.log('vehicles', vehicles)}</>
    </div>
  )
}

export default VehicleTableBody