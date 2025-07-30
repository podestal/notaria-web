import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { IngresoPoderesPage } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import Calendar from "../../../ui/Calendar";
import { useEffect } from "react";

interface Props {
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IngresoPoderesPage, Error>>
    dateFrom: Date | undefined;
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    dateTo: Date | undefined;
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>;
    page: number;
}

const PoderesFueraDeRegistroFilters = ({ refetch, dateFrom, setDateFrom, dateTo, setDateTo, page }: Props) => {


    useEffect(() => {
        refetch()
    }, [page])

    const handleRefetch = () => {
        console.log('Refetching with dates:', dateFrom, dateTo);

        refetch()  // Refetching the data when filters are applied
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
                onClick={handleRefetch}
                className="bg-blue-500 text-white rounded-lg text-sm py-2 px-4 hover:bg-blue-600 cursor-pointer">Buscar</button>
        </div>
    </div>
  )
}

export default PoderesFueraDeRegistroFilters