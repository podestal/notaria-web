import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import Calendar from "../../../ui/Calendar"
import { IngresoCartasPage } from "../../../../services/api/extraprotocolares/ingresoCartas"



interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>
    refetch:(options?: RefetchOptions) => Promise<QueryObserverResult<IngresoCartasPage, Error>>
}

const ExtraProtocolaresHeader = ({ dateFrom, dateTo, setDateFrom, setDateTo, refetch }: Props) => {


    const handleFilter = () => {
        console.log('refetching')
        refetch()
    }

  return (
<div className="w-full grid grid-cols-3 gap-4 justify-center items-center text-center my-6">
        <div className="flex flex-col justify-center items-center gap-4 font-semibold text-sm">
            <p>Fecha Inicio</p>
            <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} />
        </div>
        <div className="flex flex-col justify-center items-center gap-4 font-semibold text-sm">
            <p>Fecha Fin</p>
            <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} />
        </div>
        <div>
            <button 
                onClick={handleFilter}
                className="bg-blue-500 text-white rounded-lg text-sm py-2 px-4 hover:bg-blue-600 cursor-pointer">Buscar</button>
        </div>
    </div>
  )
}

export default ExtraProtocolaresHeader