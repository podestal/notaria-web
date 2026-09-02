import { Users } from "lucide-react"
import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import ParticipaTableBody from "./ParticipaTableBody"

interface Props {
    contratantes: ContratantesPorActo[]
    detalleActo: string
    monto?: string
    kardex: string
}

const ParticipaTable = ({ contratantes, detalleActo, monto, kardex }: Props) => {

  return (
    <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Users className="h-4 w-4" aria-hidden />
                </span>
                <div>
                    <h3 className="text-sm font-semibold text-slate-800">Participantes</h3>
                    <p className="text-xs text-slate-500">
                        {contratantes.length} contratante{contratantes.length !== 1 ? 's' : ''} en el acto
                    </p>
                </div>
            </div>
            {monto && Number(monto) > 0 && (
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                    Importe acto: {monto}
                </span>
            )}
        </div>
        <ParticipaTableBody 
            contratantes={contratantes}
            detalleActo={detalleActo}
            monto={monto}
            kardex={kardex}
        />
    </section>
  )
}

export default ParticipaTable
