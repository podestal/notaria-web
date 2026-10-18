import { motion } from "framer-motion"
import Calendar from "../../../ui/Calendar"
import SingleSelect from "../../../ui/SingleSelect"
import { CalendarDays, Loader2, Shield } from "lucide-react"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import type { UifReportPolicy } from "../../../../services/uif/uifService"

interface Props {
    dateFrom: Date | undefined
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    dateTo: Date | undefined
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>
    reportPolicy: UifReportPolicy
    setReportPolicy: React.Dispatch<React.SetStateAction<UifReportPolicy>>
    onGenerate: () => void
    isLoading: boolean
}

const RegistroUifFilters = ({
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    reportPolicy,
    setReportPolicy,
    onGenerate,
    isLoading,
}: Props) => {
    const { setMessage, setShow, setType } = useNotificationsStore()

    const handleGenerateRO = () => {
        if (!dateFrom || !dateTo) {
            setMessage("Por favor, selecciona una fecha de inicio y fin")
            setShow(true)
            setType("error")
            return
        }
        onGenerate()
    }

  return (
    <div className="border-b border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
            <span className="rounded-lg bg-indigo-50 p-2 ring-1 ring-indigo-100">
                <Shield className="h-4 w-4 text-indigo-600" />
            </span>
            <div>
                <h2 className="text-sm font-semibold text-slate-800">Información requerida para UIF</h2>
                <p className="text-xs text-slate-500">Seleccione fechas y tipo de registro para generar el RO</p>
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
            <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Tipo</p>
                <SingleSelect
                    options={[
                        { value: "all", label: "Cronológico" },
                        { value: "alfabetico", label: "Alfabético" },
                    ]}
                    selected={reportPolicy}
                    onChange={(value) => setReportPolicy(value as UifReportPolicy)}
                />
            </div>
            <motion.button
                type="button"
                onClick={handleGenerateRO}
                disabled={isLoading}
                whileHover={isLoading ? undefined : { y: -1 }}
                whileTap={isLoading ? undefined : { scale: 0.97 }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Generando..." : "Generar RO"}
            </motion.button>
        </div>
    </div>
  )
}

export default RegistroUifFilters
