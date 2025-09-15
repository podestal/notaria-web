import { useState } from "react"
import SimpleInput from "../../../ui/SimpleInput"
import ParticipaFormularioTable from "./ParticipaFormularioTable"


const ParticipaFormularioForm = () => {

    const [numOp, setNumOp] = useState('')
    const [monto, setMonto] = useState('')

  return (
    <div className="w-full grid grid-cols-2 gap-4">
        <div className="w-full">
            <h2 className="text-md font-bold">Ingrese formulario</h2>
            <div className="my-6 flex flex-col gap-4">
                <SimpleInput
                    value={numOp}
                    setValue={setNumOp}
                    label="N° Op. Sunat /N° de Orden"
                    horizontal
                />
                <SimpleInput
                    value={monto}
                    setValue={setMonto}
                    label="Monto"
                    horizontal
                />
               <div className="w-full flex items-center justify-center mt-6">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer transition-all duration-300">
                        Grabar
                    </button>
               </div>
            </div>
        </div>
        <div className="w-full">
            <h2 className="text-md font-bold mb-6">Formularios</h2>
            <ParticipaFormularioTable />
        </div>
    </div>
  )
}

export default ParticipaFormularioForm