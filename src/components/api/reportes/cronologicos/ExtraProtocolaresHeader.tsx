import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import Calendar from "../../../ui/Calendar"
import { IngresoCartasPage } from "../../../../services/api/extraprotocolares/ingresoCartas"
import { Sheet, FileText } from "lucide-react"



interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>
    refetch:(options?: RefetchOptions) => Promise<QueryObserverResult<IngresoCartasPage, Error>>
    generatesWord: boolean
    generatesExcel: boolean
}

const ExtraProtocolaresHeader = ({ 
    dateFrom, 
    dateTo, 
    setDateFrom, 
    setDateTo, 
    refetch,
    generatesWord,
    generatesExcel
}: Props) => {


    const handleFilter = () => {
        console.log('refetching')
        refetch()
    }

  return (
<div className="w-full grid grid-cols-6 gap-4 justify-center items-center text-center my-6">
        <div className="flex flex-col col-span-2 justify-center items-center gap-4 font-semibold text-sm">
            <p>Fecha Inicio</p>
            <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} />
        </div>
        <div className="flex flex-col col-span-2 justify-center items-center gap-4 font-semibold text-sm">
            <p>Fecha Fin</p>
            <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} />
        </div>
        <div>
            <button 
                onClick={handleFilter}
                className="bg-blue-500 text-white rounded-lg text-sm py-2 px-4 hover:bg-blue-600 cursor-pointer">Buscar</button>
        </div>
        <div className="flex justify-center items-center gap-8">
            <div 
                className="flex flex-col items-center justify-center w-20 h-20 bg-white shadow-md rounded-lg mt-4 cursor-pointer hover:bg-gray-100 transition-colors">
                <FileText className="w-6 h-6 text-blue-500 hover:text-blue-700 cursor-pointer mb-2" />
                <p className="text-[10px] text-center text-gray-700">Word</p>
            </div>
            <div 
                className="flex flex-col items-center justify-center w-20 h-20 bg-white shadow-md rounded-lg mt-4 cursor-pointer hover:bg-gray-100 transition-colors">
                <Sheet className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer mb-2" />
                <p className="text-[10px] text-center text-gray-700">Excel</p>
            </div>
        </div>
    </div>
  )
}

export default ExtraProtocolaresHeader