import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import Calendar from "../../../ui/Calendar";
import SimpleInput from "../../../ui/SimpleInput";
import { LibrosPage } from "../../../../services/api/extraprotocolares/librosService";

interface Props {
    cliente: string;
    numDoc: string;
    cronologico: string;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    setCliente: React.Dispatch<React.SetStateAction<string>>;
    setNumDoc: React.Dispatch<React.SetStateAction<string>>;
    setCronologico: React.Dispatch<React.SetStateAction<string>>;
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>;
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<LibrosPage, Error>>
}

const LibrosFilters = ({ 
    cliente, 
    numDoc, 
    cronologico, 
    dateFrom, 
    dateTo, 
    setCliente, 
    setNumDoc, 
    setCronologico, 
    setDateFrom, 
    setDateTo,
    refetch
}: Props) => {

    const handleFilter = () => {
        // Logic to handle filtering based on the inputs
        console.log("Filtering with:", {
            cliente,
            numDoc,
            cronologico,
            dateFrom,
            dateTo,
        });
        refetch();
    }

  return (
    <div className="p-4">
        <div className="p-4 mb-4">
            <h2 className="text-lg text-center font-semibold my-4">Busqueda por:</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <SimpleInput
                    label="Empresa / Cliente"
                    value={cliente}
                    setValue={setCliente}
                    horizontal
                />
                <SimpleInput
                    label="DNI / RUC"
                    value={numDoc}
                    setValue={setNumDoc}
                    horizontal
                />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <SimpleInput
                    label="Cronológico"
                    value={cronologico}
                    setValue={setCronologico}
                    horizontal
                />
            </div>
             <h2 className="text-lg text-center font-semibold my-4">Busqueda por Fecha:</h2>
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
        </div>
    </div>
  )
}

export default LibrosFilters