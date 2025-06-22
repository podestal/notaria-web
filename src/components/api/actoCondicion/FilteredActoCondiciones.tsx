import useGetActoCondicionByTipoActo from "../../../hooks/api/actoCondicion/useGetActoCondicionByTipoActo";
import useGetDetalleActosByKardexAndTipoActo from "../../../hooks/api/detalleActos/useGetDetalleActosByKardexAndTipoActo";
import useAuthStore from "../../../store/useAuthStore";
import MultiSelect from "../../ui/MultiSelect";

interface Props {
    idtipoacto: string
    kardex: string
    selectedActos: string[]
    setSelectedActos: React.Dispatch<React.SetStateAction<string[]>>
}

const FilteredActoCondiciones = ({ idtipoacto, kardex, selectedActos, setSelectedActos }: Props) => {

    const access = useAuthStore((state) => state.access_token) || ''
    const { data: actoCondiciones, isLoading: isLoadingCondicion, isError: isErrorCondicion, isSuccess: isSuccessCondicion } = useGetActoCondicionByTipoActo({ idtipoacto })
    const { data: detalleActo, isLoading: isLoadingDetalleActos, isError: isErrorDetalleActos, isSuccess: isSuccessDetalleActos } = useGetDetalleActosByKardexAndTipoActo({ access, kardex, tipoacto: idtipoacto })

    if (isLoadingCondicion || isLoadingDetalleActos) return <p className="animate-pulse text-center text-xs my-6">Cargando condiciones...</p>

    if (isErrorCondicion || isErrorDetalleActos) return <p className="text-red-500 text-center text-xs my-6">Error al cargar data</p>

    if (isSuccessCondicion && isSuccessDetalleActos && actoCondiciones.length === 0) {
        return <p className="text-xs text-center text-gray-500 my-4">No hay condiciones disponibles para este tipo de acto</p>
    }
    if (isSuccessCondicion && isSuccessDetalleActos && actoCondiciones.length > 0) 

  return (
    <>
        <p className="text-lg text-center font-semibold">{detalleActo.desacto}</p>
        <MultiSelect 
            options={actoCondiciones.map(condicion => ({
                id: `${condicion.idcondicion}.${detalleActo.item}`,
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