import useGetContratantesPorActoByKardex from "../../../hooks/api/contratantesPorActo/useGetContratantesPorActoByKardex"
import useGetDetalleActosByKardexAndTipoActo from "../../../hooks/api/detalleActos/useGetDetalleActosByKardexAndTipoActo"
import useGetPatrimonialByKardex from "../../../hooks/api/patrimonial/useGetPatrimonialByKardex"
import { Kardex } from "../../../services/api/kardexService"
import useAuthStore from "../../../store/useAuthStore"
import ParticipaGenerate from "./ParticipaGenerate"
import ParticipaTable from "./ParticipaTable"

interface Props {
    kardex: Kardex
}

const ParticipaMain = ({ kardex }: Props) => {

  const access = useAuthStore( s => s.access_token) || ''
  const tipoacto = kardex.codactos?.slice(0, 3)
  const detalleActoDescripcion = kardex.contrato?.split('/')[0]
  
  
  const { data: detalleActoObj, isLoading: isLoadingDetalleActos, isError: isErrorDetalleActos, error: errorDetalleActos, isSuccess: isSuccessDetalleActos } = useGetDetalleActosByKardexAndTipoActo({ access, kardex: kardex.kardex, tipoacto: tipoacto })
  const { data: contratantes, isLoading: isLoadingContratantes, isError: isErrorContratantes, isSuccess: isSuccessContratantes } = useGetContratantesPorActoByKardex({ access, kardex: kardex.kardex})
  const { data: patrimonial, isLoading: isLoadingPatrimonial, isError: isErrorPatrimonial, isSuccess: isSuccessPatrimonial } = useGetPatrimonialByKardex({ access, kardex: kardex.kardex})

  if (isLoadingDetalleActos || isLoadingContratantes || isLoadingPatrimonial) return <p className="text-center text-gray-500 text-xs animate-pulse">Cargando...</p>

  if (isErrorDetalleActos || isErrorContratantes || isErrorPatrimonial) return <p className="text-center text-red-500 text-xs">Error al cargar los actos: ${errorDetalleActos?.message}</p>

  if (isSuccessDetalleActos && isSuccessContratantes && isSuccessPatrimonial) 
  return (
    <div className="my-6">
        <ParticipaTable 
            contratantes={contratantes}
            detalleActo={detalleActoDescripcion}
            monto={patrimonial[0]?.importetrans || '0'}
            kardex={kardex.kardex}
        />
        <ParticipaGenerate 
            kardex={kardex.kardex}
            item={detalleActoObj.item}
        />
    </div>
  )
}

export default ParticipaMain