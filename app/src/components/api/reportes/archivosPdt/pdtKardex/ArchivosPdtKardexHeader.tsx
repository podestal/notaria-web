import { AlertTriangle, CheckCircle2, FileSpreadsheet, Loader2, RefreshCcw } from 'lucide-react'
import moment from 'moment'
import ArchivoPdtKardexFiles from './ArchivoPdtKardexFiles'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
    count: number
    errors: number
    refetch: any
    typeKardex: number
    typeKardexName: string
}

const ArchivosPdtKardexHeader = ({ dateFrom, dateTo, count, errors, refetch, typeKardex, typeKardexName }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const clean = Math.max(0, count - errors)

    const handleRefetch = () => {
        setIsLoading(true)
        refetch().finally(() => {
            setIsLoading(false)
        })
    }

    const cards = [
        {
            label: "Kardex",
            value: count,
            icon: FileSpreadsheet,
            tone: "border-slate-200 bg-slate-50 text-slate-800",
            iconTone: "bg-sky-50 text-sky-600 ring-sky-100",
        },
        {
            label: "Errores",
            value: errors,
            icon: AlertTriangle,
            tone: "border-rose-200 bg-rose-50 text-rose-700",
            iconTone: "bg-rose-100 text-rose-600 ring-rose-200",
        },
        {
            label: "Sin errores",
            value: clean,
            icon: CheckCircle2,
            tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
            iconTone: "bg-emerald-100 text-emerald-600 ring-emerald-200",
        },
    ]

  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.08 }}
        className="border-b border-slate-200 px-4 py-5 sm:px-6"
    >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 className="text-sm font-semibold text-slate-800">Resumen PDT {typeKardexName}</h2>
                <p className="text-xs text-slate-500">
                    {dateFrom && dateTo
                        ? `${moment(dateFrom).format('DD/MM/YYYY')} – ${moment(dateTo).format('DD/MM/YYYY')}`
                        : "Seleccione un rango de fechas"}
                </p>
            </div>
            <motion.button
                type="button"
                onClick={handleRefetch}
                whileHover={isLoading ? undefined : { y: -1 }}
                whileTap={isLoading ? undefined : { scale: 0.97 }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
                Actualizar errores ({errors})
            </motion.button>
        </div>
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {cards.map((card, i) => {
                const Icon = card.icon
                return (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                        className={`rounded-xl border px-3.5 py-3 ${card.tone}`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{card.label}</p>
                            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ring-1 ${card.iconTone}`}>
                                <Icon className="h-3.5 w-3.5" aria-hidden />
                            </span>
                        </div>
                        <p className="mt-1 text-2xl font-semibold tabular-nums">{card.value}</p>
                    </motion.div>
                )
            })}
        </div>
        <ArchivoPdtKardexFiles
            initialDate={dateFrom}
            finalDate={dateTo}
            typeKardex={typeKardex}
        />
    </motion.div>
  )
}

export default ArchivosPdtKardexHeader
