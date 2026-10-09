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

  if (isSuccessDetalleActos && isSuccessContratantes && isSuccessPatrimonial) {
  // Only parte 1 (vendedor/otorgante) and 2 (comprador/beneficiario) take part in the distribution.
  const participantes = (Array.isArray(contratantes) ? contratantes : []).filter((c) => {
    const parte = (c.parte || '').trim()
    return parte === '1' || parte === '2'
  })

  return (
    <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm">
            <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-800">
                    Participación UIF/PDT
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                    Calcule porcentajes y montos según el importe patrimonial del acto.
                </p>
            </div>
            <div className="[&_button]:inline-flex [&_button]:items-center [&_button]:gap-2 [&_button]:rounded-lg [&_button]:bg-emerald-600 [&_button]:px-5 [&_button]:py-2.5 [&_button]:text-sm [&_button]:font-semibold [&_button]:text-white [&_button]:shadow-md [&_button]:transition [&_button]:hover:bg-emerald-700 [&_button]:my-0">
                <ParticipaGenerate 
                    kardex={kardex.kardex}
                    item={detalleActoObj.item}
                />
            </div>
        </div>
        <ParticipaTable 
            contratantes={participantes}
            detalleActo={detalleActoDescripcion}
            monto={patrimonial[0]?.importetrans || '0'}
            kardex={kardex.kardex}
        />
    </div>
  )
  }
}

export default ParticipaMain
