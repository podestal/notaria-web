import useGetActoCondicionByTipoActo from "../../../hooks/api/actoCondicion/useGetActoCondicionByTipoActo";

interface Props {
    idtipoacto: string
}

const FilteredActoCondiciones = ({ idtipoacto }: Props) => {

    const { data: actoCondiciones, isLoading, isError, error, isSuccess } = useGetActoCondicionByTipoActo({ idtipoacto })

    if (isLoading) return <p className="animate-pulse text-center text-xs my-6">Cargando condiciones...</p>

    if (isError) return <p className="text-red-500 text-center text-xs my-6">Error al cargar condiciones: {error.message}</p>

    if (isSuccess && actoCondiciones.length === 0) {
        return <p className="text-xs text-center text-gray-500 my-4">No hay condiciones disponibles para este tipo de acto</p>
    }
    if (isSuccess && actoCondiciones.length > 0) 

  return (
    <>
        <p>Seleccione condiciones</p>
        <>{console.log('open', open)}</>
        <ul>
            { actoCondiciones.map((condicion) => (
                <li
                    key={condicion.idcondicion}
                    className="text-xs text-gray-700 my-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md"
                    onClick={() => {
                        // Aquí puedes manejar la selección de la condición
                        console.log(`Condición seleccionada: ${condicion.condicion}`);
                    }}
                >
                    {condicion.condicion}
                </li>
            ))}
        </ul>
    </>
  )
}

export default FilteredActoCondiciones