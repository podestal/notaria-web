import SimpleSelector from "../../ui/SimpleSelector"
import { MEDIOS_PAGO, BANCOS, MONEDAS } from "../../../data/patrimonialData"
import SimpleInput from "../../ui/SimpleInput"
import DateInput from "../../ui/DateInput"


const DetalleMediosDePagoForm = () => {
  return (
    <div className=" w-[80%] mx-auto flex flex-col justify-center items-center gap-2">
        <h2 className="text-center font-bold text-lg mb-8">Nuevo Medio de Pago/Tipo de fondo</h2>
        <div className="grid grid-cols-2 gap-8 my-4">
            <SimpleSelector 
                defaultValue={0}
                label="Medio de Pago"
                options={[{ value: 0, label:'Seleccione Medio de pago' }, ...MEDIOS_PAGO.map(medioPago => ({
                    value: medioPago.codmepag,
                    label: medioPago.desmpagos
                }))]}
                horizontal
                setter={() => {}}
            />
            <SimpleInput 
                setValue={() => {}}
                value=""
                horizontal
                label="Importe M. Pago/T. fondo"
            />
        </div>
        <div className="grid grid-cols-2 gap-8 my-4">
            <SimpleSelector 
                defaultValue={0}
                label="Entidad Financiera"
                options={[{ value: 0, label:'Seleccione Banco' }, ...BANCOS.map(banco => ({
                    value: banco.idbancos,
                    label: banco.desbanco
                }))]}
                horizontal
                setter={() => {}}
            />
            <DateInput 
                value=""
                setValue={() => {}}
                horizontal
                label="Fecha de operación"
            />
        </div>
        <div className="grid grid-cols-2 gap-8 my-4">
            <SimpleSelector 
                defaultValue={0}
                label="Tipo de Moneda"
                options={[{ value: 0, label:'Seleccione Moneda' }, ...MONEDAS.map(moneda => ({
                    value: moneda.idmon,
                    label: moneda.desmon
                }))]}
                horizontal
                setter={() => {}}
            />
            <SimpleInput 
                setValue={() => {}}
                value=""
                horizontal
                label="Documentos"
                
            />
        </div>
        <div className="flex items-center justify-center gap-4 my-8">
            <button
                className=" bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
                Guardar
            </button>
        </div>
    </div>
  )
}

export default DetalleMediosDePagoForm