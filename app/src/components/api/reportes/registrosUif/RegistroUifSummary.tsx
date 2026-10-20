import { AlertTriangle, CalendarDays, FileSpreadsheet, Shield } from "lucide-react"
import moment from "moment"
import { motion } from "framer-motion"
import RegistroUifPlaneText from "./RegistroUifPlaneText"
import RegistroUifExcel from "./RegistroUifExcel"
import type { UifReportPolicy } from "../../../../services/uif/uifService"

moment.locale('es')

interface Props {
    count: number
    totalErrors: number
    dateFrom: Date | undefined
    dateTo: Date | undefined
    reportPolicy: UifReportPolicy
}

const spanishMonths = {
  0: 'Enero', 1: 'Febrero', 2: 'Marzo', 3: 'Abril',
  4: 'Mayo', 5: 'Junio', 6: 'Julio', 7: 'Agosto',
  8: 'Septiembre', 9: 'Octubre', 10: 'Noviembre', 11: 'Diciembre'
}

const RegistroUifSummary = ({ count, totalErrors, dateFrom, dateTo, reportPolicy }: Props) => {
  const monthName = dateFrom ? spanishMonths[dateFrom.getMonth() as keyof typeof spanishMonths] : ''

  return (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.08 }}
        className="border-b border-slate-200 px-4 py-5 sm:px-6"
    >
        <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-800">Resumen de operaciones UIF</h2>
            <p className="text-xs text-slate-500">
                {dateFrom && dateTo
                    ? `${moment(dateFrom).format('DD/MM/YYYY')} – ${moment(dateTo).format('DD/MM/YYYY')}`
                    : "Seleccione un rango de fechas"}
                {monthName ? ` · ${monthName} ${moment(dateFrom).format('YYYY')}` : ""}
            </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
                transition={{ delay: 0.14 }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3"
            >
                <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Kardex</p>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                        <Shield className="h-3.5 w-3.5" aria-hidden />
                    </span>
                </div>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-800">{count}</p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3"
            >
                <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-600">Errores</p>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-600 ring-1 ring-rose-200">
                        <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                    </span>
                </div>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-rose-700">{totalErrors}</p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-3"
            >
                <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-700">Archivos</p>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 ring-1 ring-indigo-200">
                        <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden />
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <RegistroUifPlaneText dateFrom={dateFrom} dateTo={dateTo} reportPolicy={reportPolicy} />
                    <RegistroUifExcel dateFrom={dateFrom} dateTo={dateTo} reportPolicy={reportPolicy} />
                </div>
            </motion.div>
        </div>
    </motion.div>
  )
}

export default RegistroUifSummary
