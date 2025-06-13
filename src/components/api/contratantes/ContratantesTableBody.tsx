import useGetContratantesByKardex from "../../../hooks/api/contratantes/useGetContratantesByKardex"
import { Kardex } from "../../../services/api/kardexService"
import ContratanteCard from "./ContratanteCard"


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
    <>{console.log('contratante', contratantes)}</>
    {contratantes.map((contratante) => (
        <ContratanteCard 
            key={contratante.idcontratante}
            contratante={contratante}
            kardexUsuario={kardex.usuario}
        />
    ))}
    </>
    :
    <p className="text-xs text-center text-gray-80 my-4">No se encontraron contratanes para este documento</p>
    }
    </>
  )
}

export default ContratantesTableBody