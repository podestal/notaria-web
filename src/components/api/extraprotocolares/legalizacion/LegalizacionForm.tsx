import { FileCog, FileText, Save } from "lucide-react"
import { useState } from "react";
import Calendar from "../../../ui/Calendar";
import SimpleSelector from "../../../ui/SimpleSelector";
import { documentNaturalOptions } from "../../../../data/clienteData";
import SimpleInput from "../../../ui/SimpleInput";

const LegalizacionForm = () => {

    const [fechaIngreso, setFechaIngreso] = useState<Date | undefined>(new Date());
    const [tipoDocumento, setTipoDocumento] = useState(1);
    const [documento, setDocumento] = useState('');
    const [address, setAddress] = useState('');
    const [cuerpo, setCuerpo] = useState('CERTIFICO: QUE LAS FIRMAS QUE ANTECEDEN CORRESPONDEN A   A SOLICITUD DE LOS MISMOS LEGALIZO SUS FIRMAS EN  EL 26 de julio de 2025');

  return (
    <div>
        <div className="grid grid-cols-8 gap-2">
            <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <Save className="text-xl"/>
                <p className="text-xs">Guardar</p>
            </div>
            <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <FileCog className="text-xl text-green-600"/>
                <p className="text-xs">Generar</p>
            </div>
            <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <FileText className="text-xl text-slate-50"/>
                <p className="text-xs">Ver Doc</p>
            </div>
        </div>
        <div className="flex justify-end items-center gap-12 font-semibold text-sm">
            <p>Fecha de ingreso:</p>
            <Calendar 
                selectedDate={fechaIngreso}
                setSelectedDate={setFechaIngreso}
            />
        </div>
        <div>
            <h2 className="text-lg text-center font-semibold my-4">Solicitante</h2>
            <div className="grid grid-cols-2 gap-4 my-4">
                <SimpleSelector 
                    label="Tipo de documento"
                    options={documentNaturalOptions}
                    setter={setTipoDocumento}
                    defaultValue={tipoDocumento}
                />
                <SimpleInput 
                    label="Número"
                    value={documento}
                    setValue={setDocumento}
                    horizontal
                    fullWidth
                />
            </div>
           <SimpleInput 
                label="Dirección"
                value={address}
                setValue={setAddress}
                horizontal
                fullWidth
            />
            <button className="bg-blue-200 text-blue-600 hover:opacity-85 text-sm rounded-lg px-4 py-2 cursor-pointer my-4 font-semibold">Agregar Solicitante</button>
        </div>
        <div>
                <div className="grid grid-cols-9 gap-4 bg-slate-100 text-black text-xs font-semibold p-2 my-4">
                    <p>N°</p>
                    <p className="col-span-3">Nombre</p>
                    <p>DNI</p>
                    <p className="col-span-2">Condición</p>
                    <p className="col-span-2">Acción</p>
                </div>
                <div>
                    <p className="text-center text-xs my-4">Aún no hay solicitantes agregados</p>
                </div>
        </div>
        <div>
            <button className="bg-blue-200 text-blue-600 hover:opacity-85 text-sm rounded-lg px-4 py-2 cursor-pointer my-4 font-semibold">Mostrar</button>
            <h2 className="text-lg text-center font-semibold my-4">Cuerpo</h2>
            <textarea className="w-full h-32 p-2 border border-gray-300 rounded-md" value={cuerpo} onChange={(e) => setCuerpo(e.target.value)}></textarea>
        </div>
    </div>
  )
}

export default LegalizacionForm