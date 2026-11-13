import { useMemo } from "react"
import useGetContratantesByKardex from "../../../hooks/api/contratantes/useGetContratantesByKardex"
import { Kardex } from "../../../services/api/kardexService"
import { Contratante } from "../../../services/api/contratantesService"
import { groupContratantesBySide } from "../../../utils/sortContratantesDisplay"
import ContratanteCard from "./ContratanteCard"

interface Props {
    kardex: Kardex
}

const SectionHeader = ({ title, count }: { title: string; count: number }) => (
    <div className="col-span-9 flex items-center gap-2 rounded-md bg-slate-100/90 px-3 py-2 border border-slate-200">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
            {title}
        </span>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500 border border-slate-200">
            {count}
        </span>
    </div>
)

const Section = ({
    title,
    items,
    kardex,
}: {
    title: string
    items: Contratante[]
    kardex: Kardex
}) => (
    <div className="space-y-2">
        <SectionHeader title={title} count={items.length} />
        {items.length === 0 ? (
            <p className="text-xs text-slate-400 italic px-1 py-2">
                Sin {title.toLowerCase()}
            </p>
        ) : (
            items.map((contratante) => (
                <ContratanteCard
                    key={`${title}-${contratante.idcontratante}`}
                    contratante={contratante}
                    kardex={kardex}
                />
            ))
        )}
    </div>
)

const ContratantesTableBody = ({ kardex }: Props) => {
    const { data: contratantes, isLoading, isError, error, isSuccess } =
        useGetContratantesByKardex({ kardex: kardex.kardex })

    const grouped = useMemo(
        () =>
            groupContratantesBySide(
                Array.isArray(contratantes) ? (contratantes as Contratante[]) : [],
            ),
        [contratantes],
    )

    if (isLoading) return <p className="text-md animate-pulse text-center">Cargando ...</p>

    if (isError) return <p className="text-md text-red-500 text-center">Error: {error.message}</p>

    if (!isSuccess) return null

    const list = Array.isArray(contratantes) ? contratantes : []
    if (list.length === 0) {
        return (
            <p className="text-xs text-center text-gray-500 my-4">
                No se encontraron contratantes para este documento
            </p>
        )
    }

    return (
        <div className="space-y-5">
            <Section title="Otorgantes" items={grouped.otorgantes} kardex={kardex} />
            <Section title="Beneficiarios" items={grouped.beneficiarios} kardex={kardex} />
        </div>
    )
}

export default ContratantesTableBody
