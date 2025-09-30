import { useState } from "react"
import { Kardex } from "../../../services/api/kardexService"
import DateInput from "../../ui/DateInput"
import SimpleInput from "../../ui/SimpleInput"
import { UseMutationResult } from "@tanstack/react-query"
import { UpdateKardexData } from "../../../hooks/api/kardex/useUpdateKardex"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import moment from "moment"
import Calendar from "../../ui/Calendar"

interface Props {
    kardex: Kardex
    updateKardex: UseMutationResult<Kardex, Error, UpdateKardexData>
}


const EscrituracionForm = ({ kardex, updateKardex }: Props) => {

    console.log('kardex', kardex);
    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } = useNotificationsStore()

    const [numMinuta, setNumMinuta] = useState(kardex.numminuta || '')
    const [numEscritura, setNumEscritura] = useState(kardex.numescritura || '')
    const [fechaMinuta, setFechaMinuta] = useState<Date | undefined>(kardex.fechaescritura ? moment(kardex.fechaescritura, 'YYYY-MM-DD').toDate() : undefined)
    const [numActa, setNumActa] = useState(kardex.numescritura || '')
    const [follioIni, setFolioIni] = useState(kardex.folioini || '')
    const [folioFin, setFolioFin] = useState(kardex.foliofin || '')
    const [serieNotarialIni, setSerieNotarialIni] = useState(kardex.papelini || '')
    const [serieNotarialFin, setSerieNotarialFin] = useState(kardex.papelfin || '')
    const [fechaActa, setFechaActa] = useState(kardex.fechaescritura || '')

    const [tomo, setTomo] = useState(kardex.txa_minuta || '')
    const [registro, setRegistro] = useState(kardex.numinstrmento || '')

    const [papelTraslNotarialIni, setPapelTraslNotarialIni] = useState(kardex.papeltrasladoini || '')
    const [papelTraslNotarialFin, setPapelTraslNotarialFin] = useState(kardex.papeltrasladofin || '')


    // ERRORS
    const [errorNumActa, setErrorNumActa] = useState('')
    const [errorFechaActa, setErrorFechaActa] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Submitting EscrituracionForm with values:');


        if (!fechaActa) {
            setErrorFechaActa('La fecha de acta es requerida')
            return
        }

        const fechaMinutaStr = fechaMinuta ? moment(fechaMinuta).format('YYYY-MM-DD') : ''

        updateKardex.mutate({
            kardex: {
                idtipkar: kardex.idtipkar,
                fechaingreso:kardex.fechaingreso,
                referencia: kardex.referencia || '',
                codactos: kardex.codactos,
                idusuario: kardex.idusuario,
                responsable: kardex.responsable,
                retenido: 0,
                desistido: 0,
                autorizado: 0,
                idrecogio: 0,
                pagado: 0,
                visita: 0,
                idnotario: 1,
                contrato: kardex.contrato, 
                numescritura: numActa || numEscritura,
                numminuta: numMinuta,
                fktemplate: kardex.fktemplate,
                papelini: serieNotarialIni,
                papelfin: serieNotarialFin,
                folioini: follioIni,
                foliofin: folioFin,
                fechaescritura: fechaMinutaStr,
                txa_minuta: tomo,
                numinstrmento: registro,
                papeltrasladoini: papelTraslNotarialIni,
                papeltrasladofin: papelTraslNotarialFin,
            },
            access
        }, {
            onSuccess: (res) => {
                console.log('Escrituración actualizada:', res);
                setMessage('Escrituración actualizada correctamente')
                setShow(true)
                setType('success')
            },
            onError: (err) => {
                setMessage(err.message)
                setShow(true)
                setType('error')
            }
        })
    }

    const generateDate = () => {
        const currentDate = moment().format('DD/MM/YYYY');
        setFechaActa(currentDate);
    }

  return (
    <form 
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-6 w-full my-6">
            <div className=" w-[80%]">
                {kardex.idtipkar === 1 && 
                <>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={setNumMinuta}
                        value={numMinuta}
                        horizontal
                        label="N° de Minuta"
                    />
                    <SimpleInput 
                        setValue={setNumEscritura}
                        value={numEscritura}
                        horizontal
                        label="N° de Escritura"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <div className="grid grid-cols-3 items-center gap-2">
                        <p className="pl-2 block text-xs font-semibold text-slate-700">Fecha de escritura</p>
                        <Calendar
                            selectedDate={fechaMinuta}
                            setSelectedDate={setFechaMinuta}   
                        />
                    </div>
                </div>
                </>
                }
                {kardex.idtipkar === 3 && 
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={setNumActa}
                        value={numActa}
                        horizontal
                        label="N° de Acta"
                        required
                        error={errorNumActa}
                        setError={setErrorNumActa}
                    />
                </div>}
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={setFolioIni}
                        value={follioIni}
                        horizontal
                        label="N° de Folio del"
                    />
                    <SimpleInput 
                        setValue={setFolioFin}
                        value={folioFin}
                        horizontal
                        label="Al"
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={setSerieNotarialIni}
                        value={serieNotarialIni}
                        horizontal
                        label="Serie Notarial del"
                    />
                    <SimpleInput 

                        setValue={setSerieNotarialFin}
                        value={serieNotarialFin}
                        horizontal
                        label="Al"
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={setTomo}
                        value={tomo}
                        horizontal
                        label="Tomo"
                    />
                    <SimpleInput 
                        setValue={setRegistro}
                        value={registro}
                        horizontal
                        label="Registro"
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={setPapelTraslNotarialIni}
                        value={papelTraslNotarialIni}
                        horizontal
                        label="Papel de trasl notarial"
                    />
                    <SimpleInput 
                        setValue={setPapelTraslNotarialFin}
                        value={papelTraslNotarialFin}
                        horizontal
                        label="Al"
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <DateInput 
                        setValue={setFechaActa}
                        value={fechaActa}
                        horizontal
                        label="Fecha de Acta"
                        required
                        error={errorFechaActa}
                        setError={setErrorFechaActa}
                    />
                    <div className="flex items-center justify-start">
                    <button
                        className="gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer flex flex-col my-4 justify-center items-center"
                        type="button"
                        onClick={generateDate}
                    >
                        {/* <Newspaper /> */}
                        <p className="text-xs">Generar</p>
                    </button>
                    </div>
                </div>
                <button

                    className="mt-8 bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                    Guardar
                </button>
            </div>

    </form>
  )
}

export default EscrituracionForm