import { useState } from "react"
import { motion } from "framer-motion"
import { Kardex } from "../../../services/api/kardexService"
import getTitleCase from "../../../utils/getTitleCase"
import KardexForm from "./KardexForm"
import KardexLogsPanel from "./KardexLogsPanel"
import TopModal from "../../ui/TopModal"
import useUpdateKardex from "../../../hooks/api/kardex/useUpdateKardex"
import useRetrieveKardex from "../../../hooks/api/kardex/useRetrieveKardex"
import useAuthStore from "../../../store/useAuthStore"
import useUserInfoStore from "../../../hooks/store/useGetUserInfo"
import KardexCompliancePastMonthsAlert from "./KardexCompliancePastMonthsAlert"
import { useCompliancePastMonthsUrgent } from "./useCompliancePastMonthsUrgent"
import { KARDEX_GRID_COLUMNS } from "./KardexTableHeader"

interface Props {
    kardex: Kardex
    readyOnly?: boolean
    index?: number
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

const KardexCard = ({ kardex, readyOnly, index = 0 }: Props) => {
    const access = useAuthStore(s => s.access_token) || ''
    const user = useUserInfoStore(s => s.user)
    const isSuperuser = Number(user?.is_superuser) !== 0
    const [open, setOpen] = useState(false)
    const [getKardex, setGetKardex] = useState(false)
    const updateKardex = useUpdateKardex({ kardexId: kardex.idkardex })
    const { show: pastUrgent } = useCompliancePastMonthsUrgent()
    const { data: singleKardex, isLoading, isError, error, isSuccess } = useRetrieveKardex({
        id: kardex.idkardex,
        enabled: getKardex,
        access,
    })
    const showLogs = isSuperuser && open

    const openKardex = () => {
        if (readyOnly) return
        setGetKardex(true)
        setOpen(true)
    }

    const contratantes = getTitleCase(kardex.cliente || '')
    const usuario = getTitleCase(kardex.usuario || '')

  return (
    <>
    <motion.div 
        key={kardex.idkardex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: Math.min(index, 20) * 0.03, ease: "easeOut" }}
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
            <span className={`inline-flex rounded-md bg-sky-50 px-2 py-1 font-mono text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100 transition duration-200 ${
                readyOnly ? '' : 'group-hover:scale-105 group-hover:bg-sky-100 group-hover:ring-sky-200 group-hover:shadow-sm'
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
    </motion.div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
        wide={showLogs}
        tone={pastUrgent ? "danger" : "default"}
        banner={
            pastUrgent ? <KardexCompliancePastMonthsAlert sticky /> : null
        }
    >
        {isLoading && (
            <p className="text-md my-2 animate-pulse text-center">Cargando ...</p>
        )}
        {isError && (
            <p className="text-md text-center text-red-500">Error: {error.message}</p>
        )}
        {isSuccess && singleKardex && (
            showLogs ? (
                <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:gap-0">
                    <div className="flex max-h-[32vh] shrink-0 flex-col lg:max-h-none lg:w-[22rem] xl:w-96">
                        <KardexLogsPanel
                            idkardex={singleKardex.idkardex}
                            enabled={open}
                            className="h-full lg:max-h-none"
                        />
                    </div>
                    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto lg:pl-4">
                        <KardexForm
                            kardex={singleKardex}
                            updateKardex={updateKardex}
                        />
                    </main>
                </div>
            ) : (
                <KardexForm
                    kardex={singleKardex}
                    updateKardex={updateKardex}
                />
            )
        )}
    </TopModal>
    </>
  )
}

export default KardexCard
