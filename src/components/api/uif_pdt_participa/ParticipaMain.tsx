import useGetDetalleActosByKardexAndTipoActo from "../../../hooks/api/detalleActos/useGetDetalleActosByKardexAndTipoActo"
import { Kardex } from "../../../services/api/kardexService"
import useAuthStore from "../../../store/useAuthStore"
import ParticipaGenerate from "./ParticipaGenerate"
import ParticipaTable from "./ParticipaTable"

interface Props {
    kardex: Kardex
}

const ParticipaMain = ({ kardex }: Props) => {

  const access = useAuthStore( s => s.access_token) || ''
  const tipoacto = kardex.codactos.slice(0, 3)
  
  const { data: detalleActos, isLoading, isError, error, isSuccess } = useGetDetalleActosByKardexAndTipoActo({ access, kardex: kardex.kardex, tipoacto: tipoacto })

  if (isLoading) return <p className="text-center text-gray-500 text-xs animate-pulse">Cargando...</p>

  if (isError) return <p className="text-center text-red-500 text-xs">Error al cargar los actos: ${error.message}</p>

  if (isSuccess)
  return (
    <div className="my-6">
        <>{console.log('UIF/PDT Participa kardex', detalleActos)}</>
        <ParticipaTable />
        <ParticipaGenerate />
    </div>
  )
}

export default ParticipaMain