import Calendar from "../../../ui/Calendar"
import SingleSelect from "../../../ui/SingleSelect";
import { Loader } from "lucide-react";
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore";
import type { UifReportPolicy } from "../../../../services/uif/uifService";

interface Props {
    dateFrom: Date | undefined;
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    dateTo: Date | undefined;
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
            setMessage('Por favor, selecciona una fecha de inicio y fin')
            setShow(true)
            setType('error')
            return
        }

        onGenerate()
    }

  return (
    <div>
        <h2 className="text-lg text-center font-semibold my-4">Información requerida para UIF:</h2>
        <div className="w-full grid grid-cols-3 gap-4 justify-center items-center text-center my-6">
            <div className="flex flex-col justify-center items-center gap-4 font-semibold text-sm">
                <p>Fecha Inicio</p>
                <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4 font-semibold text-sm">
                <p>Fecha Fin</p>
                <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} />
            </div>
            <SingleSelect
                options={[
                    { value: "all", label: "Cronológico" },
                    { value: "alfabetico", label: "Alfabético" },
                ]}
                selected={reportPolicy}
                onChange={(value) => setReportPolicy(value as UifReportPolicy)}
            />
        </div>
        <div className="flex justify-center items-center">
            <button
                type="button"
                onClick={handleGenerateRO}
                disabled={isLoading}
                className="bg-blue-600 text-white text-xs px-4 py-2 rounded-md w-[100px] mx-auto mt-4 cursor-pointer hover:bg-blue-700 transition-all duration-300 disabled:opacity-60"
            >
                {isLoading ? <Loader className="animate-spin text-center text-xs w-[12px] h-[12px] mx-auto" /> : 'Generar RO'}
            </button>
        </div>
    </div>
  )
}

export default RegistroUifFilters
