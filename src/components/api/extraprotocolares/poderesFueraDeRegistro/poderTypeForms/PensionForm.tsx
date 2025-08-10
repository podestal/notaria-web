
import { useState } from "react"

interface Props {
    poderId: number;
}

const PensionForm = ({ poderId }: Props) => {
    // const [open, setOpen] = useState(false)

    const [loading, setLoading] = useState(false)
  return (
<div>
    <h2 className="text-lg font-bold mb-4 text-center">Pensiones</h2>
    <div className="grid grid-cols-2 gap-4 my-4">
        {/* <SimpleSelectorStr
            label="Tipo"
            defaultValue={tipoRegistro}
            setter={setTipoRegistro}
            options={[{ value: '0', label: 'Seleccionar Tipo' }, { value: '1', label: 'Registro' }, { value: '2', label: 'Poder fuera de registro base' }]}
        />
        <SimpleInput 
            label="Plazo"
            value={plazo}
            setValue={setPlazo}
            horizontal
        /> */}
    </div>
    <div className="grid grid-cols-2 gap-4 my-4">
        {/* <DateInput 
            label="Fecha de otorgamiento"
            value={fechaOtorgamiento}
            setValue={setFechaOtorgamiento}
            horizontal
        />
        <DateInput 
            label="Fecha de vencimiento"
            value={fechaVencimiento}
            setValue={setFechaVencimiento}
            horizontal
        /> */}
    </div>
    <div className="flex gap-4 justify-center items-start my-4">
        {/* <p className="pl-2 text-xs font-semibold text-slate-700">Solicita</p>
        <textarea
            value={solicita}
            onChange={(e) => setSolicita(e.target.value)}
            className="w-full h-32 p-2 border border-slate-300 rounded"
        /> */}
    </div>
    <div className="flex justify-evenly items-center my-4">
        {/* <button 
            className=" bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer transition-all duration-300"
            onClick={handleSave}
            disabled={isLoading}
        >{isLoading ? 'Guardando...' : 'Guardar'}</button>
        <button 
            className=" bg-red-500 text-white p-2 rounded-md hover:bg-red-600 cursor-pointer transition-all duration-300"
            onClick={() => setOpen(false)}
        >Cancelar</button> */}
    </div>    

</div>
  )
}

export default PensionForm