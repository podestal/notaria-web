import { useState } from "react"
import { Kardex } from "../../../services/api/kardexService"
import getTitleCase from "../../../utils/getTitleCase"
import KardexForm from "./KardexForm"
import TopModal from "../../ui/TopModal"
import useUpdateKardex from "../../../hooks/api/kardex/useUpdateKardex"
import useRetrieveKardex from "../../../hooks/api/kardex/useRetrieveKardex"
import useAuthStore from "../../../store/useAuthStore"
import KardexCompliancePastMonthsAlert from "./KardexCompliancePastMonthsAlert"
import { useCompliancePastMonthsUrgent } from "./useCompliancePastMonthsUrgent"
import { KARDEX_GRID_COLUMNS } from "./KardexTableHeader"

interface Props {
    kardex: Kardex
    readyOnly?: boolean
}

const Empty = () => <span className="text-slate-300">—</span>

const CellValue = ({ value, className = "" }: { value?: string | null; className?: string }) => {
    const text = (value ?? '').toString().trim()
    return <p className={`truncate ${className}`} title={text || undefined}>{text || <Empty />}</p>
}

const getInitials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() ?? '')
        .join('')

const KardexCard = ({ kardex, readyOnly }: Props) => {
    const access = useAuthStore(s => s.access_token) || ''
    const [open, setOpen] = useState(false)
    const [getKardex, setGetKardex] = useState(false)
    const updateKardex = useUpdateKardex({ kardexId: kardex.idkardex })
    const { show: pastUrgent } = useCompliancePastMonthsUrgent()

    const openKardex = () => {
        if (readyOnly) return
        setGetKardex(true)
        setOpen(true)
    }

    const contratantes = getTitleCase(kardex.cliente || '')
    const usuario = getTitleCase(kardex.usuario || '')

  return (
    <>
    <div 
        key={kardex.idkardex}
        role={readyOnly ? undefined : "button"}
        tabIndex={readyOnly ? undefined : 0}
        onClick={openKardex}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openKardex()
            }
        }}
        className={`group grid items-center gap-3 px-4 py-3 text-xs text-slate-700 transition-colors ${
            readyOnly ? '' : 'cursor-pointer hover:bg-sky-50/70 focus:bg-sky-50/70 focus:outline-none'
        }`}
        style={{ gridTemplateColumns: KARDEX_GRID_COLUMNS }}
    >
        <div>
            <span className={`inline-flex rounded-md bg-sky-50 px-2 py-1 font-mono text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100 transition ${
                readyOnly ? '' : 'group-hover:bg-sky-100 group-hover:ring-sky-200'
            }`}>
                {kardex.kardex}
            </span>
        </div>
        <CellValue value={kardex.fechaingreso} className="tabular-nums text-slate-600" />
        <p className="line-clamp-2 leading-snug text-slate-700" title={kardex.contrato || undefined}>
            {kardex.contrato || <Empty />}
        </p>
        <p className="break-words font-medium leading-snug text-slate-800">
            {contratantes || <Empty />}
        </p>
        <CellValue value={kardex.fechaescritura} className="tabular-nums text-slate-600" />
        <CellValue value={kardex.numescritura} className="text-center font-mono font-semibold text-slate-800" />
        <CellValue value={kardex.numminuta} className="text-center font-mono" />
        <CellValue value={kardex.folioini} className="text-center font-mono" />
        <CellValue value={kardex.foliofin} className="text-center font-mono" />
        <CellValue value={kardex.numinstrmento} className="text-center font-mono" />
        <CellValue value={kardex.txa_minuta} className="text-center font-mono" />
        <div className="flex min-w-0 items-center gap-2" title={usuario || undefined}>
            {usuario ? (
                <>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700">
                        {getInitials(usuario)}
                    </span>
                    <span className="truncate text-slate-600">{usuario}</span>
                </>
            ) : <Empty />}
        </div>
    </div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
        tone={pastUrgent ? "danger" : "default"}
        banner={
            pastUrgent ? <KardexCompliancePastMonthsAlert sticky /> : null
        }
    >
        <>
        {(() => {
            const {data: singleKardex, isLoading, isError, error, isSuccess} = useRetrieveKardex({ id: kardex.idkardex , enabled: getKardex, access })
            if (isLoading) return <p className="text-md animate-pulse text-center my-2">Cargando ...</p>
            if (isError) return <p className="text-md text-red-500 text-center">Error: {error.message}</p>
            if (isSuccess)
            return (
                <KardexForm 
                    kardex={singleKardex}
                    // onClose={() => setOpen(false)}
                    updateKardex={updateKardex}
                />
            )
        })()}
        </>
            
    </TopModal>
    </>
  )
}

export default KardexCard
