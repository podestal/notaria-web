import { BookOpen, CalendarDays } from 'lucide-react'
import moment from 'moment'
import { motion } from 'framer-motion'
import ArchivoPdtLibroDownload from './ArchivoPdtLibroDownload'

interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
    count: number
}

const ArchivosPdtLibrosHeader = ({ dateFrom, dateTo, count }: Props) => {
  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.08 }}
        className="border-b border-slate-200 px-4 py-5 sm:px-6"
    >
        <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-800">Resumen PDT Libros</h2>
            <p className="text-xs text-slate-500">
                {dateFrom && dateTo
                    ? `${moment(dateFrom).format('DD/MM/YYYY')} – ${moment(dateTo).format('DD/MM/YYYY')}`
                    : "Seleccione un rango de fechas"}
            </p>
        </div>
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3"
            >
                <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Periodo</p>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                    {dateFrom && dateTo
                        ? `${moment(dateFrom).format('DD/MM/YYYY')} – ${moment(dateTo).format('DD/MM/YYYY')}`
                        : "—"}
                </p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3"
            >
                <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Libros</p>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                        <BookOpen className="h-3.5 w-3.5" aria-hidden />
                    </span>
                </div>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-800">{count}</p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3"
            >
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                    Archivo plano
                </p>
                <ArchivoPdtLibroDownload initialDate={dateFrom} finalDate={dateTo} />
            </motion.div>
        </div>
    </motion.div>
  )
}

export default ArchivosPdtLibrosHeader
