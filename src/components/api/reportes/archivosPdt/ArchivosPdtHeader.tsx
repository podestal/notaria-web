import { Dispatch, SetStateAction } from "react"
import Calendar from "../../../ui/Calendar"
import { Loader } from "lucide-react"

interface Props {
    dateFrom: Date | undefined
    setDateFrom: Dispatch<SetStateAction<Date | undefined>>
    dateTo: Date | undefined
    setDateTo: Dispatch<SetStateAction<Date | undefined>>
    loading: boolean
    setLoading: Dispatch<SetStateAction<boolean>>
    refetch: () => Promise<void>
}

const ArchivosPdtHeader = ({ 
    dateFrom, 
    setDateFrom, 
    dateTo, 
    setDateTo, loading, setLoading, refetch }: Props) => {

    const handleGeneratePDT = () => {
        setLoading(true)
        refetch().finally(() => {
            setLoading(false)
        })
    }

  return (
    <div>
        <h2 className="text-lg text-center font-semibold my-4">Información requerida para PDT:</h2>
        <div className="w-full grid grid-cols-2 gap-4 justify-center items-center text-center my-6">
            <div className="flex flex-col justify-center items-center gap-4 font-semibold text-sm">
                <p>Fecha Inicio</p>
                <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4 font-semibold text-sm">
                <p>Fecha Fin</p>
                <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} />
            </div>
        </div>
        <div className="flex justify-center items-center pb-4">
            <button 
                onClick={handleGeneratePDT}
                disabled={loading}
                className="bg-blue-600 text-white text-xs px-4 py-2 rounded-md w-[120px] mx-auto mt-4 cursor-pointer hover:bg-blue-700 transition-all duration-300"
            >
                {loading ? <Loader className="animate-spin text-center text-xs w-[12px] h-[12px] mx-auto" /> : 'Generar PDT'}
            </button>  
        </div>
    </div>
  )
}

export default ArchivosPdtHeader