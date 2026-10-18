import { Dispatch, SetStateAction } from "react"
import { motion } from "framer-motion"
import Calendar from "../../../ui/Calendar"
import { CalendarDays, Loader2, FileSpreadsheet } from "lucide-react"

interface Props {
    dateFrom: Date | undefined
    setDateFrom: Dispatch<SetStateAction<Date | undefined>>
    dateTo: Date | undefined
    setDateTo: Dispatch<SetStateAction<Date | undefined>>
    loading: boolean
    setLoading: Dispatch<SetStateAction<boolean>>
    refetch: any
}

const ArchivosPdtHeader = ({
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    loading,
    setLoading,
    refetch,
}: Props) => {
    const handleGeneratePDT = () => {
        setLoading(true)
        refetch().finally(() => {
            setLoading(false)
        })
    }

  return (
    <div className="border-b border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
            <span className="rounded-lg bg-blue-50 p-2 ring-1 ring-blue-100">
                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
            </span>
            <div>
                <h2 className="text-sm font-semibold text-slate-800">Información requerida para PDT</h2>
                <p className="text-xs text-slate-500">Seleccione el rango de fechas y genere el archivo</p>
            </div>
        </div>
        <div className="flex flex-wrap items-end gap-4">
            <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" /> Fecha inicio
                </p>
                <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} fullWidth />
            </div>
            <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" /> Fecha fin
                </p>
                <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} fullWidth />
            </div>
            <motion.button
                type="button"
                onClick={handleGeneratePDT}
                disabled={loading}
                whileHover={loading ? undefined : { y: -1 }}
                whileTap={loading ? undefined : { scale: 0.97 }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Generando..." : "Generar PDT"}
            </motion.button>
        </div>
    </div>
  )
}

export default ArchivosPdtHeader
