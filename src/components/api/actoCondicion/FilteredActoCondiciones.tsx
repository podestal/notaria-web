import useGetActoCondicionByTipoActo from "../../../hooks/api/actoCondicion/useGetActoCondicionByTipoActo";
import MultiSelect from "../../ui/MultiSelect";

interface Props {
    idtipoacto: string
    selectedActos: string[]
    setSelectedActos: React.Dispatch<React.SetStateAction<string[]>>
}

const FilteredActoCondiciones = ({ idtipoacto, selectedActos, setSelectedActos }: Props) => {

    const { data: actoCondiciones, isLoading, isError, error, isSuccess } = useGetActoCondicionByTipoActo({ idtipoacto })

    if (isLoading) return <p className="animate-pulse text-center text-xs my-6">Cargando condiciones...</p>

    if (isError) return <p className="text-red-500 text-center text-xs my-6">Error al cargar condiciones: {error.message}</p>

    if (isSuccess && actoCondiciones.length === 0) {
        return <p className="text-xs text-center text-gray-500 my-4">No hay condiciones disponibles para este tipo de acto</p>
    }
    if (isSuccess && actoCondiciones.length > 0) 

  return (
    <>
        <p className="text-lg text-center font-semibold">Seleccione condiciones</p>
        <>{console.log('actoCondiciones', actoCondiciones)}</>
        <MultiSelect 
            options={actoCondiciones.map(condicion => ({
                id: condicion.idcondicion,
                label: condicion.condicion
            }))}
            placeholder="Seleccione condiciones"
            label=""
            selectedIds={selectedActos}
            setSelectedIds={setSelectedActos}
        />
    </>
  )
}

export default FilteredActoCondiciones