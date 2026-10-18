import { Loader2, RefreshCcw } from 'lucide-react'
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

    const handleRefetch = () => {
        setIsLoading(true)
        refetch().finally(() => {
            setIsLoading(false)
        })
    }

  return (
    <div className="border-b border-slate-200 px-4 py-5 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 className="text-sm font-semibold text-slate-800">Resumen de operaciones PDT {typeKardexName}</h2>
                <p className="text-xs text-slate-500">
                    {moment(dateFrom).format('DD/MM/YYYY')} – {moment(dateTo).format('DD/MM/YYYY')}
                </p>
            </div>
            <motion.button
                type="button"
                onClick={handleRefetch}
                whileHover={isLoading ? undefined : { y: -1 }}
                whileTap={isLoading ? undefined : { scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-700 bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
                Actualizar errores ({errors})
            </motion.button>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Kardex</p>
                <p className="mt-0.5 text-lg font-semibold tabular-nums text-slate-800">{count}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-red-600">Errores</p>
                <p className="mt-0.5 text-lg font-semibold tabular-nums text-red-700">{errors}</p>
            </div>
        </div>
        <ArchivoPdtKardexFiles
            initialDate={dateFrom}
            finalDate={dateTo}
            typeKardex={typeKardex}
        />
    </div>
  )
}

export default ArchivosPdtKardexHeader
