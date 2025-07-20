import Calendar from "../../ui/Calendar";
import { useState } from "react";
import SimpleSelector from "../../ui/SimpleSelector";

const estadoSisgenOptions = [
    { value: -1, label: "Todos" },
    { value: 0, label: "No Enviado" },
    { value: 1, label: "Enviado" },
    { value: 2, label: "Enviado Observado" },
    { value: 3, label: "No Enviado Fallido" },
    { value: 4, label: "Sin Codigo Ancert" },
    { value: 5, label: "Todos Documentos" }
]

interface Props {
    instrumentType: number
}

const SisgenSearchForm = ({ instrumentType }: Props) => {

    const [selectedFromDate, setSelectedFromDate] = useState<Date | undefined>(undefined);
    const [selectedToDate, setSelectedToDate] = useState<Date | undefined>(undefined);
    const [selectedEstado, setSelectedEstado] = useState(-1);

    const [errorDisplay, setErrorDisplay] = useState('');


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setErrorDisplay('');
        console.log('instrumentType:', instrumentType);
        
        if (!selectedFromDate) {
            setErrorDisplay('Por favor, seleccione una fecha de inicio.');
            return;
        }

        if (!selectedToDate) {
            setErrorDisplay('Por favor, seleccione una fecha de fin.');
            return;
        }

        if (selectedFromDate > selectedToDate) {
            setErrorDisplay('La fecha de inicio no puede ser posterior a la fecha de fin.');
            return;
        }


    }

  return (
        <form
            onSubmit={handleSubmit}
            className="h-full">
            {errorDisplay && (
                <p className="text-red-500 text-center text-sm my-2">
                    {errorDisplay}
                </p>
            )}
            <div className="w-full flex justify-evenly items-center gap-4 my-6 h-full">
                <div className="w-full flex justify-evenly items-center">
                    <p className="font-semibold">Estado</p>
                    <SimpleSelector 
                        options={estadoSisgenOptions}
                        setter={setSelectedEstado}
                        defaultValue={selectedEstado}
                    />
                </div>
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
        </form>
  )
}

export default SisgenSearchForm