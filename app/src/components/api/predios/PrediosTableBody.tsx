import useGetPrediosByKardex from "../../../hooks/api/predios/useGetPrediosByKardex"
import useAuthStore from "../../../store/useAuthStore"
import PrediosCard from "./PrediosCard"

interface Props {
    kardex: string
}

const PrediosTableBody = ({ kardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: predios, isLoading, isError, error, isSuccess } = useGetPrediosByKardex({ access, kardex })

    if ( isLoading) return <p className="text-center animate-pulse my-4">Cargando...</p>

    if (isError) return <p className="text-center text-red-500 my-4">Error: {error.message}</p>

    if (isSuccess)

  return (
    <>
      {predios.length > 0 ? (
        <>
          {predios.map((predio) => (
            <PrediosCard key={predio.id_predio} predio={predio} />
          ))}
        </>
      ) : (
        <p className="text-center my-4">No hay predios disponibles</p>
      )}
    </>
  )
}

export default PrediosTableBody