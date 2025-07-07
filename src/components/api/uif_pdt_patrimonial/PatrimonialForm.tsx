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
import { Kardex } from "../../../services/api/kardexService";
import PatrimonialTipoActoSelector from "./PatrimonialTipoActoSelector";
import getTipoActoIdArray from "../../../utils/getTipoActoIdArray";
import useNotificationsStore from "../../../hooks/store/useNotificationsStore";
import { UpdatePatrimonialData } from "../../../hooks/api/patrimonial/useUpdatePatrimonial";
import TopModal from "../../ui/TopModal";
import ExplanationMessage from "../../ui/ExplanationMessage";
import CreateDetalleMediosDePago from "../detalleMediosDePago/CreateDetalleMediosDePago";
import DetalleMediosDePagoTable from "../detalleMediosDePago/DetalleMediosDePagoTable";

interface Props {
    createPatrimonial?: UseMutationResult<Patrimonial, Error, CreatePatrimonialData>
    updatePatrimonial?: UseMutationResult<Patrimonial, Error, UpdatePatrimonialData>
    kardex: Kardex
    patrimonial?: Patrimonial
    setIdTipoActo?: React.Dispatch<React.SetStateAction<string>>
}

const exhibiompOptions = [
    { value: 'Si', label: 'Si' },
    { value: 'No', label: 'No' }
]

const PatrimonialForm = ({ 
    createPatrimonial, 
    updatePatrimonial,
    kardex,
    patrimonial,
    setIdTipoActo }: Props) => {

    const { setMessage, setShow, setType } = useNotificationsStore()
    const [cannotUpdatePatrimonial, setCannotUpdatePatrimonial] = useState(false)
    const [cannotUpdatePatrimonialMessage, setCannotUpdatePatrimonialMessage] = useState('')

    const access = useAuthStore(s => s.access_token) || ''

    const [formaDePagoSelected, setFormaDePagoSelected] = useState(patrimonial ? patrimonial.fpago : '');
    const [oportunidadSelected, setOportunidadSelected] = useState( patrimonial ? patrimonial.idoppago : '');
    const [selectedTipoDeActo, setSelectedTipoDeActo] = useState( patrimonial ? patrimonial.idtipoacto : '');

    const [inporteTransaccion, setImporteTransaccion] = useState(patrimonial ? patrimonial.importetrans.toString() : '');
    const [monedaSelected, setMonedaSelected] = useState(patrimonial ? patrimonial.idmon : 2);

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(patrimonial ? moment(patrimonial.nminuta, "DD/MM/YYYY").toDate() : undefined);

    const [exhibiompSelected, setExhibiompSelected] = useState(patrimonial ? patrimonial.exhibiomp : 'Si');
    const [tipoDeCambio, setTipoDeCambio] = useState(patrimonial ? patrimonial.tipocambio : '');

    // ERROR HANDLING
    const [formaDePagoError, setFormaDePagoError] = useState('');
    const [oportunidadError, setOportunidadError] = useState('');
    const [selectedTipoDeActoError, setSelectedTipoDeActoError] = useState('');
    const [importeTransaccionError, setImporteTransaccionError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formaDePagoSelected) {
            setFormaDePagoError('Debe seleccionar una forma de pago');
            return;
        }

        if (oportunidadSelected === 'S' || oportunidadSelected === '') {
            setOportunidadError('Debe seleccionar una oportunidad de pago');
            return;
        }

        if (!selectedTipoDeActo) {
            setSelectedTipoDeActoError('Debe seleccionar un tipo de acto');
            return;
        }

        if (!selectedDate) {
            setMessage('Debe seleccionar una fecha de acta');
            setShow(true);
            setType('error');
            return
        }

        if (!inporteTransaccion) {
            setImporteTransaccionError('Debe ingresar un importe de transacción');
            return;
        }

        // after validation
        createPatrimonial && createPatrimonial.mutate({
            access,
            patrimonial: {
                itemmp: 'xxxxxx',
                kardex: kardex.kardex,
                idtipoacto: selectedTipoDeActo,
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
                setIdTipoActo && setIdTipoActo(res.idtipoacto);
                setMessage('Patrimonial creado exitosamente');
                setShow(true);
                setType('success');
                
            },
            onError: err => {
                console.error('Error creating patrimonial:', err);
                setMessage(`Error al crear patrimonial: ${err.message}`);
                setShow(true);
                setType('error');
            }
        })

        if (updatePatrimonial && patrimonial) {
            updatePatrimonial.mutate({
                access,
                patrimonial: {
                    itemmp: patrimonial.itemmp,
                    kardex: kardex.kardex,
                    idtipoacto: selectedTipoDeActo,
                    nminuta: moment(selectedDate).format('DD/MM/YYYY'),
                    idmon: monedaSelected,
                    tipocambio: tipoDeCambio,
                    importetrans: parseFloat(inporteTransaccion),
                    exhibiomp: exhibiompSelected,
                    presgistral: patrimonial.presgistral,
                    nregistral: patrimonial.nregistral,
                    idsedereg: '0',  // sede regional add
                    fpago: formaDePagoSelected,
                    idoppago: oportunidadSelected,
                    ofondos: '',
                    item: patrimonial.item
                }
            }, {
                onSuccess: res => {
                    console.log('response', res);
                    setMessage('Patrimonial actualizado exitosamente');
                    setShow(true);
                    setType('success');
                },
                onError: error => {
                    console.error('Error updating patrimonial:', error);
                    let errorMessage = ''
                    if ((error as any)?.response?.data?.error ) {
                        setCannotUpdatePatrimonial(true)
                        setCannotUpdatePatrimonialMessage((error as any)?.response?.data?.error)
                    } else {
                        setMessage(`Error al actualizar el kardex: ${errorMessage}`)
                        setShow(true)
                        setType('error')
                    }
                }
            })
        }
    }

  return (
    <>
        <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 bg-white rounded shadow-md"
    >
        <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Formulario Patrimonial</h2>
        {/* <>{console.log('patrimonial', patrimonial)}</> */}
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
                required
            />
            <SimpleSelectorStr 
                options={[{ value: 'S', label: 'Seleccione' }, ...OPPORTUNIDADES_PAGO.map((oportunidad) => ({
                    value: oportunidad.codoppago,
                    label: oportunidad.desoppago
                }))]}
                defaultValue={oportunidadSelected}
                setter={setOportunidadSelected}
                label="Oportunidad de Pago"
                error={oportunidadError}
                setError={setOportunidadError}
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <PatrimonialTipoActoSelector 
                idtipkar={kardex.idtipkar}
                kardexActos={getTipoActoIdArray(kardex.codactos)}
                selectedTipoDeActo={selectedTipoDeActo}
                setSelectedTipoDeActo={setSelectedTipoDeActo}
                error={selectedTipoDeActoError}
                setError={setSelectedTipoDeActoError}
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
                error={importeTransaccionError}
                setError={setImporteTransaccionError}
                required
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
        <div className="w-full grid grid-cols-3 my-4">
            {patrimonial && 
            <CreateDetalleMediosDePago 
                patrimonial={patrimonial}
            />}
            <div className="flex justify-center items-center">
            <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" type="submit">
                Grabar
            </button>
            </div>
        </div>
    </form>
    <TopModal
        isOpen={cannotUpdatePatrimonial}
        onClose={() => setCannotUpdatePatrimonial(false)}
    >
        <ExplanationMessage
            onClick={() => {
                setCannotUpdatePatrimonial(false)
                setCannotUpdatePatrimonialMessage('')}}
            message={cannotUpdatePatrimonialMessage}
        />

    </TopModal>
    {patrimonial && 
    <DetalleMediosDePagoTable 
        patrimonial={patrimonial}
    />}
    </>
  )
}

export default PatrimonialForm