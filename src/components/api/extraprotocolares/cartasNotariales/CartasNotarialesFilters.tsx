import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import Calendar from "../../../ui/Calendar"
import SimpleInput from "../../../ui/SimpleInput"
import SingleSelect from "../../../ui/SingleSelect"
import { IngresoCartasPage } from "../../../../services/api/extraprotocolares/ingresoCartas";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
    dateFrom: Date | undefined;
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    dateTo: Date | undefined;
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>;
    dateType: string; // Optional, if you want to manage a date type
    setDateType: React.Dispatch<React.SetStateAction<string>>;
    numCarta: string;
    setNumCarta: React.Dispatch<React.SetStateAction<string>>;
    remitente: string;
    setRemitente: React.Dispatch<React.SetStateAction<string>>;
    destinatario: string;
    setDestinatario: React.Dispatch<React.SetStateAction<string>>;
    page: number;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IngresoCartasPage, Error>>
}

const CartasNotarialesFilters = ({
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    dateType,
    setDateType,
    numCarta,
    setNumCarta,
    remitente,
    setRemitente,
    destinatario,
    setDestinatario,
    refetch,
}: Props) => {

    const [loading, setLoading] = useState(false)

    const handleRefetch = () => {
        setLoading(true)
        
        refetch().finally(() => setLoading(false))
    }

  return (
    <div className="pb-4">
        <div className="p-4 mb-4">
            <h2 className="text-lg text-center font-semibold my-4">Busqueda por:</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <SimpleInput
                    label="Numero de Carta"
                    value={numCarta}
                    setValue={setNumCarta}
                    horizontal
                />
                <SimpleInput
                    label="Remitente"
                    value={remitente}
                    setValue={setRemitente}
                    horizontal
                />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <SimpleInput
                    label="Destinatario"
                    value={destinatario}
                    setValue={setDestinatario}
                    horizontal
                />
            </div>
            
        </div>
        <div className="w-full grid grid-cols-4 gap-4 justify-center items-center text-center my-6">
            <div className="flex flex-col justify-center items-center gap-4 font-semibold text-sm">
                <p>Fecha Inicio</p>
                <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4 font-semibold text-sm">
                <p>Fecha Fin</p>
                <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} />
            </div>
            <div>
                <SingleSelect 
                    options={[
                        { value: '1', label: 'Fecha Ingreso' },
                        { value: '2', label: 'Fecha Diligencia' },
                    ]}
                    selected={dateType}
                    onChange={setDateType}
                />
            </div>
            <div>
                <button 
                    onClick={handleRefetch}
                    disabled={loading}
                    className="bg-blue-500 text-white rounded-lg text-sm py-2 px-4 hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <Loader2 className="animate-spin" /> : "Buscar"}
                </button>
            </div>
        </div>
    </div>
  )
}

export default CartasNotarialesFilters