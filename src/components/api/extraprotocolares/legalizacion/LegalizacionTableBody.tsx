import useGetLegalizaciones from "../../../../hooks/api/extraprotocolares/legalizacion/useGetLegalizaciones"
import useAuthStore from "../../../../store/useAuthStore"

const LegalizacionTableBody = () => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: legalizaciones, isLoading, isError, error, isSuccess } = useGetLegalizaciones({ access })

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando ...</p>
    if (isError) return <p className="text-center text-xs text-red-500 my-4">Error: {error.message}</p>

    if (isSuccess)
  return (
    <>
        {legalizaciones.results.length > 0 ? (
            <div className="pb-2">
                {legalizaciones.results.map((legalizacion) => (
                    <div key={legalizacion.idlegalizacion} className="grid grid-cols-3 gap-4 justify-center items-center text-center text-xs my-4">
                        <p>{legalizacion.idlegalizacion}</p>
                        <p>{legalizacion.fechaingreso}</p>
                        <p>{legalizacion.dni}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-center text-xs my-4">No hay legalizaciones disponibles</p>
        )}
    </>
  )
}

export default LegalizacionTableBody