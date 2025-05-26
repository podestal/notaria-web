import { FileText } from "lucide-react"
import useKardexTypesStore from "../../../hooks/store/useKardexTypesStore"
import Selector from "../../ui/Selector"
import getTitleCase from "../../../utils/getTitleCase"
import { useState } from "react"
import Calendar from "../../ui/Calendar"
import TimePicker from "../../ui/TimePicker"

const KardexForm = () => {

    const kardexTypes = useKardexTypesStore(s => s.kardexTypes)
    const [selectedKardexType, setSelectedKardexType] = useState(0)
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | undefined>(new Date().toTimeString().slice(0, 5)) // Default to current time in "HH:mm" format

  return (
    <form className="bg-slate-700 rounded-b-lg shadow-lg w-full ">
        <div className="flex justify-center items-center gap-2 p-4 rounded-t-lg text-slate-50 ">
            <FileText className="text-green-600"/>
            <h2 className="text-xl text-amber-500">Nuevo Kardex</h2>
        </div>
        <>{console.log('selectedKardexType', selectedKardexType)}</>
        <div className="bg-slate-50 text-black p-4 rounded-b-lg">
            <div className="grid grid-cols-3 place-content-start place-items-center gap-4 mb-6">
                <Selector 
                    options={[{ value: 0, label: 'Tipo de Kardex' },...kardexTypes.map(type => ({ value: type.idtipkar, label: getTitleCase(type.nomtipkar) }))]}
                    setter={setSelectedKardexType}
                />
                <Calendar 
                    selectedDate={date}
                    setSelectedDate={setDate}
                />
                <TimePicker selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
            </div>
            <p>Referencia - input - button</p>
            <div className="flex justify-between items-center gap-4">
                <p>Codigos de actos ... input</p>
                <p>Derecho Notarial ... input</p>
                <p>Derecho Registral ... input</p>
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