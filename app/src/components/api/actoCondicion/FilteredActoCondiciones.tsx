import useGetActoCondicionByTipoActo from "../../../hooks/api/actoCondicion/useGetActoCondicionByTipoActo"
import useGetDetalleActosByKardexAndTipoActo from "../../../hooks/api/detalleActos/useGetDetalleActosByKardexAndTipoActo"
import useAuthStore from "../../../store/useAuthStore"
import ActoCondicionesChecklist from "./ActoCondicionesChecklist"

interface Props {
    idtipoacto: string
    kardex: string
    selectedActos: string[]
    setSelectedActos: React.Dispatch<React.SetStateAction<string[]>>
}

const FilteredActoCondiciones = ({ idtipoacto, kardex, selectedActos, setSelectedActos }: Props) => {
    const access = useAuthStore((state) => state.access_token) || ""
    const {
        data: actoCondiciones,
        isLoading: isLoadingCondicion,
        isError: isErrorCondicion,
        isSuccess: isSuccessCondicion,
    } = useGetActoCondicionByTipoActo({ idtipoacto, access })
    const {
        data: detalleActo,
        isLoading: isLoadingDetalleActos,
        isError: isErrorDetalleActos,
        isSuccess: isSuccessDetalleActos,
    } = useGetDetalleActosByKardexAndTipoActo({ access, kardex, tipoacto: idtipoacto })

    if (isLoadingCondicion || isLoadingDetalleActos) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-6">
                <p className="animate-pulse text-center text-xs text-slate-500">Cargando condiciones...</p>
            </div>
        )
    }

    if (isErrorCondicion || isErrorDetalleActos) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-center text-xs text-red-600">Error al cargar las condiciones</p>
            </div>
        )
    }

    if (isSuccessCondicion && isSuccessDetalleActos && actoCondiciones.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-6">
                <p className="text-center text-xs text-slate-500">
                    No hay condiciones disponibles para este tipo de acto
                </p>
            </div>
        )
    }

    if (isSuccessCondicion && isSuccessDetalleActos && actoCondiciones.length > 0) {
        const options = actoCondiciones.map((condicion) => ({
            id: `${condicion.idcondicion}.${detalleActo.item}`,
            label: condicion.condicion,
        }))
        const selectedInActo = options.filter((option) => selectedActos.includes(option.id)).length

        return (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-800">{detalleActo.desacto}</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Elija las condiciones que aplican a este acto
                            </p>
                        </div>
                        {selectedInActo > 0 && (
                            <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                {selectedInActo} de {options.length}
                            </span>
                        )}
                    </div>
                </div>
                <div className="p-4">
                    <ActoCondicionesChecklist
                        options={options}
                        selectedIds={selectedActos}
                        setSelectedIds={setSelectedActos}
                    />
                </div>
            </div>
        )
    }

    return null
}

export default FilteredActoCondiciones
