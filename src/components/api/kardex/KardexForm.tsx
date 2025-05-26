import { FileText } from "lucide-react"
import useKardexTypesStore from "../../../hooks/store/useKardexTypesStore"
import Selector from "../../ui/Selector"
import getTitleCase from "../../../utils/getTitleCase"
import { useState } from "react"
import Calendar from "../../ui/Calendar"
import TimePicker from "../../ui/TimePicker"
import useGetTipoActo from "../../../hooks/api/tipoActo/useGetTipoActo"

const KardexForm = () => {

    const kardexTypes = useKardexTypesStore(s => s.kardexTypes)
    const [selectedKardexType, setSelectedKardexType] = useState(0)
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | undefined>(new Date().toTimeString().slice(0, 5)) // Default to current time in "HH:mm" format


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission logic here
    }

    const { data: tipoActos, isLoading, isError, error, isSuccess } = useGetTipoActo()

    if (isLoading) return <p className="text-sm animate-pulse text-center my-10">Cargando ....</p>
    if (isError) return <p className="text-center my-8">Error: {error.message}</p>
    if (isSuccess) 

  return (
    <form 
        onSubmit={handleSubmit}
        className="bg-slate-700 rounded-b-lg shadow-lg w-full ">
        <div className="flex justify-center items-center gap-2 p-4 rounded-t-lg text-slate-50 ">
            <FileText className="text-green-600"/>
            <h2 className="text-xl text-amber-500">Nuevo Kardex</h2>
        </div>
        <>{console.log('selectedKardexType', selectedKardexType)}</>
        <div className="bg-slate-50 text-black p-4 rounded-b-lg">
            <div className="flex justify-between gap-4 mb-6">
                <Selector 
                    options={[{ value: 0, label: 'Tipo de Kardex' },...kardexTypes.map(type => ({ value: type.idtipkar, label: getTitleCase(type.nomtipkar) }))]}
                    setter={setSelectedKardexType}
                />
                <Calendar 
                    selectedDate={date}
                    setSelectedDate={setDate}
                />
                <div className="relative w-56">
                    <TimePicker 
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center gap-4 mb-6">
                <input 
                    placeholder="Referencia del Kardex"
                    className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
                />
                <button className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">Generar Kardex</button>
            </div>
            <div className="flex justify-between items-center gap-4">
                <input 
                    placeholder="Código de Acto"
                    className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
                />
                <input 
                    placeholder="Derecho Notarial"
                    className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
                />
                <input 
                    placeholder="Derecho Registral"
                    className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
                />
            </div>
            <div className="flex justify-between items-center gap-4">
                <p>Contrato ... input</p>
                <p>Agregar Acto</p>
                <p>Ocultar Acto</p>
            </div>
            <div className="flex justify-between items-center gap-4">
                <p>rESPONSABLE ... auto user logged in</p>
                <p>Recepción ...select other users</p>
            </div>
            <div className="flex justify-between items-center gap-4">
                <p>Abogado ... select abogados</p>
                <p>Funcionario ...input </p>
            </div>
            <div className="flex justify-between items-center gap-4">
                <p>Presentante ...select</p>
                <p>Plantilla ...Select</p>
            </div>
        </div>


    </form>
  )
}

export default KardexForm