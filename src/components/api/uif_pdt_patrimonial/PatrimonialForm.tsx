import { useState } from "react";
import SimpleSelectorStr from "../../ui/SimpleSelectosStr";
import { MONEDAS, FORMAS_PAGO, OPPORTUNIDADES_PAGO } from "../../../data/patrimonialData"
import SimpleInput from "../../ui/SimpleInput";
import SimpleSelector from "../../ui/SimpleSelector";
import Calendar from "../../ui/Calendar";

const exhibiompOptions = [
    { value: 'Si', label: 'Si' },
    { value: 'No', label: 'No' }
]

const provisionalTipoActoOprions = [
    { value: 'C', label: 'Seleccione' },
    { value: 'P', label: 'COMPRA VENTA DE VEHICULO AUTOMOTOR' },
] 

const PatrimonialForm = () => {

    const [formaDePagoSelected, setFormaDePagoSelected] = useState('');
    const [oportunidadSelected, setOportunidadSelected] = useState('');

    const [inporteTransaccion, setImporteTransaccion] = useState('');
    const [monedaSelected, setMonedaSelected] = useState(0);

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const [exhibiompSelected, setExhibiompSelected] = useState('');
    const [tipoDeCambio, setTipoDeCambio] = useState('');


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

  return (
    <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 bg-white rounded shadow-md"
    >
        <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Formulario Patrimonial</h2>
        <div className="grid grid-cols-2 gap-4">
            <SimpleSelectorStr 
                options={FORMAS_PAGO.map((tipo) => ({
                    value: tipo.idtipoacto,
                    label: tipo.des_idtipoacto
                }))}
                defaultValue={formaDePagoSelected}
                setter={setFormaDePagoSelected}
                label="Tipo de Pago"
            />
            <SimpleSelectorStr 
                options={OPPORTUNIDADES_PAGO.map((oportunidad) => ({
                    value: oportunidad.codoppago,
                    label: oportunidad.desoppago
                }))}
                defaultValue={oportunidadSelected}
                setter={setOportunidadSelected}
                label="Oportunidad de Pago"
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleSelectorStr 
                options={provisionalTipoActoOprions}
                defaultValue={''}
                setter={() => {}}
                label="Tipo de Acto"
            />
            <div className="grid grid-cols-2 gap-2 items-center">
                <p className="pl-2 block text-xs font-semibold text-slate-700">
                    Fecha de Acta
                </p>
                <Calendar 
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={inporteTransaccion}
                setValue={setImporteTransaccion}
                label="Importe de la Transacción"
                horizontal
            />
            <SimpleSelector 
                options={MONEDAS.map((moneda) => ({
                    value: moneda.idmon,
                    label: moneda.desmon
                }))}
                defaultValue={monedaSelected}
                setter={setMonedaSelected}
                label="Moneda"
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleSelectorStr 
                options={exhibiompOptions}
                defaultValue={exhibiompSelected}
                setter={setExhibiompSelected}
                label="Exhibió medio de pago"
            />
            <SimpleInput 
                value={tipoDeCambio}
                setValue={setTipoDeCambio}
                label="Tipo de Cambio"
                horizontal
            />
        </div>
        <div className="w-full flex justify-center items-center my-4">
            <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" type="submit">
                Grabar
            </button>
        </div>
    </form>
  )
}

export default PatrimonialForm