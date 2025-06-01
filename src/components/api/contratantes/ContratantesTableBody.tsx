import { Pencil, SquareX } from "lucide-react"
import useGetContratantesByKardex from "../../../hooks/api/contratantes/useGetContratantesByKardex"
import { Kardex } from "../../../services/api/kardexService"
import getTitleCase from "../../../utils/getTitleCase"


interface Props {
    kardex: Kardex
}

const ContratantesTableBody = ({ kardex }: Props) => {

    const { data: contratantes, isLoading, isError, error, isSuccess  } = useGetContratantesByKardex({ kardex: kardex.kardex})

    if (isLoading) return <p className="text-md animate-pulse text-center">Cargando ...</p>

    if (isError) return <p className="text-md text-red-500 text-center">Error: {error.message}</p>
    if (isSuccess)

  return (
    <>
    {contratantes.length > 0 ? 
    <>
    {contratantes.map((contratante) => (
        <div className="grid grid-cols-9 text-xs text-black px-2 my-2 place-content-center border-b-2 border-gray-200">
            <p className="col-span-2">{getTitleCase(contratante.cliente)}</p>
            <p className="col-span-2">{getTitleCase(contratante.condicion)}</p>
            <p className="pl-2">{contratante.firma === '1' ? 'Si' : 'No'}</p>
            <p className="pl-2">{contratante.fechafirma}</p>
            <p className="pl-2">{getTitleCase(kardex.usuario)}</p>
            <p></p>
            <div className="flex items-start justify-start gap-2 pl-4">
                <SquareX 
                    size={20}
                    className="text-red-500 hover:text-red-400 cursor-pointer"
                />
                <p>|</p>
                <Pencil 
                    size={20}
                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                />
            </div>
        </div>
    ))}
    </>
    :
    <p className="text-xs text-center text-gray-80 my-4">No se encontraron contratanes para este documento</p>
    }
    </>
  )
}

export default ContratantesTableBody