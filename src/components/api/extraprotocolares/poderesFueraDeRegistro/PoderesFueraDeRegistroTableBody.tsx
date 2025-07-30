import useGetIngresoPoderes from "../../../../hooks/api/extraprotocolares/ingresoPoderes/useGetIngresoPoderes"
import useAuthStore from "../../../../store/useAuthStore"

const PoderesFueraDeRegistroTableBody = () => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: poderes, isLoading, error, isError, isSuccess } = useGetIngresoPoderes({ access, page: 1 })

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando ...</p>
    if (isError) return <p className="text-center text-xs text-red-500 my-4">Error: {error.message}</p>

    if (isSuccess)

  return (
    <div>
        <>{console.log('poderes',poderes)}</>
    </div>
  )
}

export default PoderesFueraDeRegistroTableBody