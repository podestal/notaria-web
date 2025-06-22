import { useState } from "react";
import SimpleSelectorStr from "../../ui/SimpleSelectosStr";
import { MONEDAS, FORMAS_PAGO, OPPORTUNIDADES_PAGO } from "../../../data/patrimonialData"
import SimpleInput from "../../ui/SimpleInput";
import SimpleSelector from "../../ui/SimpleSelector";
import Calendar from "../../ui/Calendar";
import { UseMutationResult } from "@tanstack/react-query";
import { CreatePatrimonialData } from "../../../hooks/api/patrimonial/useCreatePatrimonial";
import { Patrimonial } from "../../../services/api/patrimonialService";
import useAuthStore from "../../../store/useAuthStore";
import moment from "moment";

interface Props {
    createPatrimonial: UseMutationResult<Patrimonial, Error, CreatePatrimonialData>
    kardex: string
}

const exhibiompOptions = [
    { value: 'Si', label: 'Si' },
    { value: 'No', label: 'No' }
]

const provisionalTipoActoOprions = [
    { value: 'C', label: 'Seleccione' },
    { value: 'P', label: 'COMPRA VENTA DE VEHICULO AUTOMOTOR' },
] 

const PatrimonialForm = ({ createPatrimonial, kardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''

    const [formaDePagoSelected, setFormaDePagoSelected] = useState('');
    const [oportunidadSelected, setOportunidadSelected] = useState('');

    const [inporteTransaccion, setImporteTransaccion] = useState('');
    const [monedaSelected, setMonedaSelected] = useState(1);

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const [exhibiompSelected, setExhibiompSelected] = useState('Si');
    const [tipoDeCambio, setTipoDeCambio] = useState('');

    // ERROR HANDLING
    const [formaDePagoError, setFormaDePagoError] = useState('');
    const [oportunidadError, setOportunidadError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formaDePagoSelected) {
            setFormaDePagoError('Debe seleccionar una forma de pago');
            return;
        }

        if (!oportunidadSelected) {
            setOportunidadError('Debe seleccionar una oportunidad de pago');
            return;
        }

        // after validation
        createPatrimonial.mutate({
            access,
            patrimonial: {
                itemmp: 'xxxxxx',
                kardex: kardex,
                idtipoacto: provisionalTipoActoOprions.find(op => op.value === 'C')?.value || '',
                nminuta: moment(selectedDate).format('DD/MM/YYYY'),
                idmon: monedaSelected,
                tipocambio: tipoDeCambio,
                importetrans: parseFloat(inporteTransaccion),
                exhibiomp: exhibiompSelected,
                presgistral: '',
                nregistral: '',
                idsedereg: '0',  // sede regional add
                fpago: formaDePagoSelected,
                idoppago: oportunidadSelected,
                ofondos: '',
                item: 0,
            }

        }, {
            onSuccess: res => {
                console.log('response', res);
                
            },
            onError: err => {
                console.error('Error creating patrimonial:', err);
            }
        })
    }

  return (
    <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 bg-white rounded shadow-md"
    >
        <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Formulario Patrimonial</h2>
        <div className="grid grid-cols-2 gap-4">
            <SimpleSelectorStr 
                options={[{ value: '', label: 'Seleccione' }, ...FORMAS_PAGO.map((tipo) => ({
                    value: tipo.id_fpago,
                    label: tipo.descripcion
                }))]}
                defaultValue={formaDePagoSelected}
                setter={setFormaDePagoSelected}
                label="Tipo de Pago"
                error={formaDePagoError}
                setError={setFormaDePagoError}
            />
            <SimpleSelectorStr 
                options={[{ value: '', label: 'Seleccione' }, ...OPPORTUNIDADES_PAGO.map((oportunidad) => ({
                    value: oportunidad.codoppago,
                    label: oportunidad.desoppago
                }))]}
                defaultValue={oportunidadSelected}
                setter={setOportunidadSelected}
                label="Oportunidad de Pago"
                error={oportunidadError}
                setError={setOportunidadError}
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