import useGetPatrimonialByKardex from "../../../hooks/api/patrimonial/useGetPatrimonialByKardex"
import { Kardex } from "../../../services/api/kardexService"
import useAuthStore from "../../../store/useAuthStore"
import PatrimonialCard from "./PatrimonialCard"

interface Props {
    kardex: Kardex
}

const PatrimonialTableBody = ({ kardex }: Props) => {

    const access = useAuthStore((state) => state.access_token) || ''
    const { data: patrimonials, isLoading, isError, error, isSuccess } = useGetPatrimonialByKardex({ access, kardex: kardex.kardex })

    if (isLoading) return <p className="text-md animate-pulse text-center my-2">Cargando ...</p>
    if (isError) return <p className="text-md text-red-500 text-center">Error: {error.message}</p>

    if (isSuccess && patrimonials.length === 0) return <p className="text-md text-center my-2 text-xs text-gray-500">No hay datos patrimoniales</p>
    if (isSuccess && patrimonials.length > 0)
    

  return (
    <>
        {patrimonials.map((patrimonial) => (
            <div
                key={patrimonial.itemmp}
            >
                <PatrimonialCard 
                    patrimonial={patrimonial}
                    kardex={kardex}
                    key={patrimonial.itemmp}
                />
            </div>
        ))}
    </>
  )
}

export default PatrimonialTableBody