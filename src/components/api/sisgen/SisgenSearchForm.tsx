import Calendar from "../../ui/Calendar";
import { useState } from "react";

const SisgenSearchForm = () => {

    const [selectedFromDate, setSelectedFromDate] = useState<Date | undefined>(undefined);
    const [selectedToDate, setSelectedToDate] = useState<Date | undefined>(undefined);
    

  return (
        <div className="w-full flex justify-evenly items-center gap-4 my-6">
            <div className="w-full flex justify-evenly items-center">
                <p className="font-semibold">Desde</p>
                <Calendar 
                    selectedDate={selectedFromDate}
                    setSelectedDate={setSelectedFromDate}
                />
            </div>
            <div className="w-full flex justify-evenly items-center">
                <p className="font-semibold">Hasta</p>
                <Calendar 
                    selectedDate={selectedToDate}
                    setSelectedDate={setSelectedToDate}
                />
            </div>
            <button className="bg-blue-600 cursor-pointer text-sm text-white px-2 py-1 rounded-md hover:bg-blue-500 transition-colors">
                Buscar
            </button>
        </div>
  )
}

export default SisgenSearchForm