import { useMemo } from "react"
import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import { groupContratantesBySide } from "../../../utils/sortContratantesDisplay"
import ParticipaGenerateCard from "./ParticipaGenerateCard"

interface Props {
    contratantes: ContratantesPorActo[]
    detalleActo: string
    monto?: string
    kardex: string
}

const Section = ({
    title,
    items,
    detalleActo,
    monto,
    kardex,
}: {
    title: string
    items: ContratantesPorActo[]
    detalleActo: string
    monto?: string
    kardex: string
}) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                {title}
            </h4>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                {items.length}
            </span>
        </div>
        {items.length === 0 ? (
            <p className="px-1 text-xs text-slate-400 italic">Sin {title.toLowerCase()}</p>
        ) : (
            items.map((contratante) => (
                <ParticipaGenerateCard
                    key={`${title}-${contratante.id}-${contratante.idcontratante}`}
                    contratante={contratante}
                    detalleActo={detalleActo}
                    monto={monto}
                    kardex={kardex}
                />
            ))
        )}
    </div>
)

const ParticipaTableBody = ({ contratantes, detalleActo, monto, kardex }: Props) => {
    const { otorgantes, beneficiarios } = useMemo(
        () => groupContratantesBySide(Array.isArray(contratantes) ? contratantes : []),
        [contratantes],
    )

    if (contratantes.length === 0) {
        return (
            <p className="text-center text-xs text-gray-500 my-4">
                No hay contratantes participantes
            </p>
        )
    }

    return (
        <div className="space-y-5">
            <Section
                title="Otorgantes"
                items={otorgantes}
                detalleActo={detalleActo}
                monto={monto}
                kardex={kardex}
            />
            <Section
                title="Beneficiarios"
                items={beneficiarios}
                detalleActo={detalleActo}
                monto={monto}
                kardex={kardex}
            />
        </div>
    )
}

export default ParticipaTableBody
