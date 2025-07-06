import { useState } from "react"
import { Kardex } from "../../../services/api/kardexService"
import DateInput from "../../ui/DateInput"
import SimpleInput from "../../ui/SimpleInput"
import { UseMutationResult } from "@tanstack/react-query"
import { UpdateKardexData } from "../../../hooks/api/kardex/useUpdateKardex"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import moment from "moment"

interface Props {
    kardex: Kardex
    updateKardex: UseMutationResult<Kardex, Error, UpdateKardexData>
}


const EscrituracionForm = ({ kardex, updateKardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } = useNotificationsStore()

    const [numActa, setNumActa] = useState(kardex.numescritura || '')
    const [follioIni, setFolioIni] = useState(kardex.folioini || '')
    const [folioFin, setFolioFin] = useState(kardex.foliofin || '')
    const [serieNotarialIni, setSerieNotarialIni] = useState(kardex.papelini || '')
    const [serieNotarialFin, setSerieNotarialFin] = useState(kardex.papelfin || '')
    const [fechaActa, setFechaActa] = useState(kardex.fechaescritura || '')

    // ERRORS
    const [errorNumActa, setErrorNumActa] = useState('')
    const [errorFechaActa, setErrorFechaActa] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!numActa) {
            setErrorNumActa('El número de acta es requerido')
            return
        }

        if (!fechaActa) {
            setErrorFechaActa('La fecha de acta es requerida')
            return
        }

        updateKardex.mutate({
            kardex: {
                // idkardex: kardex?.idkardex || 0,
                kardex: kardex.kardex,
                idtipkar: kardex.idtipkar,
                fechaingreso:kardex.fechaingreso,
                referencia: kardex.referencia,
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
                numescritura: numActa,
                fktemplate: kardex.fktemplate,
                papelini: serieNotarialIni,
                papelfin: serieNotarialFin,
                folioini: follioIni,
                foliofin: folioFin,
                fechaescritura: fechaActa,
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
                </div>
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
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="Tomo"
                    />
                    <SimpleInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="Registro"
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="Papel de trasl notarial"
                    />
                    <SimpleInput 
                        setValue={() => {}}
                        value=""
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