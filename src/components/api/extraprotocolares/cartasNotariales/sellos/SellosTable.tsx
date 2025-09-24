import useGetSellos from "../../../../../hooks/api/extraprotocolares/ingresoCartas/sellosCartas/useGetSellos"
import useAuthStore from "../../../../../store/useAuthStore"
import getTitleCase from "../../../../../utils/getTitleCase"

interface Props {
    description: string
}

const SellosTable = ({
    description,
}: Props) => {
    
    const access = useAuthStore(s => s.access_token) || ''
    const {data: sellos, isLoading, isError, error, isSuccess} = useGetSellos({ access })

    if (isLoading) return <p className="text-center text-sm text-slate-700 my-4 animate-pulse">Cargando sellos...</p>

    if (isError) return <p className="text-center text-sm text-red-600 my-4">Error al cargar los sellos {error?.message}</p>

    if (isSuccess) 
    
  return (
    <div className="flex flex-col gap-4 text-xs">
        <div className="grid grid-cols-4 gap-4 bg-slate-100 text-black font-semibold p-2 mb-2">
            <p>Código</p>
            <p>Descripción</p>
        </div>
        <div>
            {sellos
            .filter(s => s.dessello.toLowerCase().includes(description.toLowerCase()))
            .map(s => (
                <div 
                key={s.idsello}
                className="grid grid-cols-4 px-2 py-1 gap-4 hover:bg-blue-100 cursor-pointer transition-all duration-300"
                >
                    <p>{s.idsello}</p>
                    <p className="col-span-3">{getTitleCase(s.dessello || '')}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default SellosTable