import { useState } from "react"
import { Kardex } from "../../../services/api/kardexService"
import DateInput from "../../ui/DateInput"
import SimpleInput from "../../ui/SimpleInput"
import { UseMutationResult } from "@tanstack/react-query"
import { UpdateKardexData } from "../../../hooks/api/kardex/useUpdateKardex"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import moment from "moment"
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { useCreateNotarizationReservation } from "../../../hooks/signatum/useCreateNotarizationReservation"
import type { NotarizationReservation } from "../../../services/signatum/notarizationReservationService"

interface Props {
    kardex: Kardex
    updateKardex: UseMutationResult<Kardex, Error, UpdateKardexData>
}


const formatReservationDateForInput = (value: string | undefined): string => {
    if (!value) return ''
    const trimmed = value.trim()
    const parsed = moment(trimmed, [moment.ISO_8601, 'YYYY-MM-DD', 'YYYY-MM-DDTHH:mm:ss.SSSZ'], true)
    if (parsed.isValid()) return parsed.format('DD/MM/YYYY')
    if (trimmed.includes('/')) return trimmed.slice(0, 10)
    return trimmed
}

const VTA_SUFFIX = ' VTA'

const parseFolioSerieToken = (raw: string) => {
    const t = raw.trim()
    if (!t) return null
    const hasVta = /\s+VTA\s*$/i.test(t)
    const core = t.replace(/\s+VTA\s*$/i, '').trim()
    const digits = core.match(/^(\d+)$/)
    if (!digits) return null
    return { n: parseInt(digits[1], 10), width: digits[1].length, hasVta }
}

const incrementFolioSerieValue = (value: string): string => {
    const p = parseFolioSerieToken(value)
    if (!p || Number.isNaN(p.n)) return value
    const pad = (x: number) => String(x).padStart(p.width, '0')
    if (p.hasVta) return pad(p.n + 1)
    return `${pad(p.n)}${VTA_SUFFIX}`
}

const decrementFolioSerieValue = (value: string): string => {
    const p = parseFolioSerieToken(value)
    if (!p || Number.isNaN(p.n)) return value
    const pad = (x: number) => String(Math.max(0, x)).padStart(p.width, '0')
    if (p.hasVta) return pad(p.n)
    const prev = p.n - 1
    if (prev < 0) return value
    return `${pad(prev)}${VTA_SUFFIX}`
}

const formatKardexFechaForDateInput = (value: string | undefined): string => {
    if (!value) return ''
    const m = moment(value.trim(), [moment.ISO_8601, 'YYYY-MM-DD', 'DD/MM/YYYY'], true)
    if (m.isValid()) return m.format('DD/MM/YYYY')
    if (value.includes('/')) return value.trim().slice(0, 10)
    return value.trim()
}

const dateInputToApiYmd = (ddmmyyyy: string): string => {
    const m = moment(ddmmyyyy.trim(), 'DD/MM/YYYY', true)
    return m.isValid() ? m.format('YYYY-MM-DD') : ''
}

const FolioSerieIncDec = ({ onInc, onDec }: { onInc: () => void; onDec: () => void }) => (
    <div className="flex shrink-0 flex-col rounded border border-slate-200 bg-slate-50/90 p-px shadow-sm">
        <button
            type="button"
            aria-label="Incrementar"
            onClick={onInc}
            className="rounded-sm px-0.5 py-0 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
        >
            <ChevronUp className="h-3 w-3" strokeWidth={2.25} />
        </button>
        <button
            type="button"
            aria-label="Decrementar"
            onClick={onDec}
            className="rounded-sm px-0.5 py-0 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
        >
            <ChevronDown className="h-3 w-3" strokeWidth={2.25} />
        </button>
    </div>
)

const applyReservationToForm = (
    data: NotarizationReservation,
    idtipkar: number,
    setters: {
        setNumEscritura: (v: string) => void
        setNumActa: (v: string) => void
        setFolioIni: (v: string) => void
        setFolioFin: (v: string) => void
        setSerieNotarialIni: (v: string) => void
        setSerieNotarialFin: (v: string) => void
        setFechaActa: (v: string) => void
        setFechaEscritura?: (v: string) => void
        setFechaMinuta: (v: string) => void
    }
) => {
    const { setNumEscritura, setNumActa, setFolioIni, setFolioFin, setSerieNotarialIni, setSerieNotarialFin, setFechaActa, setFechaEscritura, setFechaMinuta } =
        setters
    if (data.num_escritura != null && data.num_escritura !== '') {
        setNumEscritura(String(data.num_escritura))
        if (idtipkar === 3) setNumActa(String(data.num_escritura))
    }
    if (data.folio_ini != null && data.folio_ini !== '') setFolioIni(String(data.folio_ini))
    if (data.folio_fin != null && data.folio_fin !== '') setFolioFin(String(data.folio_fin))
    if (data.papel_ini != null && data.papel_ini !== '') setSerieNotarialIni(String(data.papel_ini))
    if (data.papel_fin != null && data.papel_fin !== '') setSerieNotarialFin(String(data.papel_fin))
    if (data.fecha_escritura) {
        const fe = formatReservationDateForInput(data.fecha_escritura)
        setFechaActa(fe)
        setFechaEscritura?.(fe)
    }
    const minutaSource = data.fecha_conclusion || data.fecha_escritura
    if (minutaSource) setFechaMinuta(formatReservationDateForInput(minutaSource))
}

const EscrituracionForm = ({ kardex, updateKardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } = useNotificationsStore()
    const createNotarizationReservation = useCreateNotarizationReservation()

    const [numMinuta, setNumMinuta] = useState(kardex.numminuta || '')
    const [numEscritura, setNumEscritura] = useState(kardex.numescritura || '')
    const [fechaMinuta, setFechaMinuta] = useState(() => formatKardexFechaForDateInput(kardex.fechaminuta))
    const [numActa, setNumActa] = useState(kardex.numescritura || '')
    const [follioIni, setFolioIni] = useState(kardex.folioini || '')
    const [folioFin, setFolioFin] = useState(kardex.foliofin || '')
    const [serieNotarialIni, setSerieNotarialIni] = useState(kardex.papelini || '')
    const [serieNotarialFin, setSerieNotarialFin] = useState(kardex.papelfin || '')
    const fmtEsc = formatKardexFechaForDateInput(kardex.fechaescritura)
    const [fechaEscritura, setFechaEscritura] = useState(() =>
        kardex.idtipkar === 1 || kardex.idtipkar === 5 ? fmtEsc : ''
    )
    const [fechaActa, setFechaActa] = useState(() => fmtEsc)

    const [tomo, setTomo] = useState(kardex.txa_minuta || '')
    const [registro, setRegistro] = useState(kardex.numinstrmento || '')

    const [papelTraslNotarialIni, setPapelTraslNotarialIni] = useState(kardex.papeltrasladoini || '')
    const [papelTraslNotarialFin, setPapelTraslNotarialFin] = useState(kardex.papeltrasladofin || '')

    const [loading, setLoading] = useState(false)
    const [signatumReservationId, setSignatumReservationId] = useState<number | undefined>(undefined)


    // ERRORS
    const [errorNumActa, setErrorNumActa] = useState('')
    const [errorFechaActa, setErrorFechaActa] = useState('')
    const [errorFechaEscritura, setErrorFechaEscritura] = useState('')
    const [errorFechaMinuta, setErrorFechaMinuta] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Submitting EscrituracionForm with values:');


        const isTip15 = kardex.idtipkar === 1 || kardex.idtipkar === 5
        if (isTip15) {
            if (!fechaEscritura.trim()) {
                setErrorFechaEscritura('La fecha de escritura es requerida')
                setErrorFechaActa('')
                return
            }
        } else if (!fechaActa.trim()) {
            setErrorFechaActa('La fecha es requerida')
            return
        }
        setLoading(true)

        const fechaMinutaStr = dateInputToApiYmd(fechaMinuta)
        const fechaEscrituraStr = isTip15 ? fechaEscritura.trim() : fechaActa.trim()

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
                fechaescritura: fechaEscrituraStr,
                txa_minuta: tomo,
                numinstrmento: registro,
                papeltrasladoini: papelTraslNotarialIni,
                papeltrasladofin: papelTraslNotarialFin,
                estado_sisgen: 0,
                fechaminuta: fechaMinutaStr,
                nc: '',
            },
            access,
            signatumReservationId
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
            },
            onSettled: () => {
                setLoading(false)
            }
        })
    }

    const handleClearEscrituracion = () => {
        if (loading) return

        setLoading(true)

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
                numescritura: '',
                numminuta: '',
                fktemplate: kardex.fktemplate,
                papelini: '',
                papelfin: '',
                folioini: '',
                foliofin: '',
                fechaescritura: '',
                txa_minuta: '',
                numinstrmento: '',
                papeltrasladoini: '',
                papeltrasladofin: '',
                estado_sisgen: 0,
                fechaminuta: '',
                nc: '',
            },
            access
        }, {
            onSuccess: () => {
                setNumMinuta('')
                setNumEscritura('')
                setFechaMinuta('')
                setNumActa('')
                setFolioIni('')
                setFolioFin('')
                setSerieNotarialIni('')
                setSerieNotarialFin('')
                setFechaEscritura('')
                setFechaActa('')
                setTomo('')
                setRegistro('')
                setPapelTraslNotarialIni('')
                setPapelTraslNotarialFin('')
                setErrorNumActa('')
                setErrorFechaActa('')
                setErrorFechaEscritura('')
                setErrorFechaMinuta('')

                setMessage('Datos de escrituracion borrados correctamente')
                setShow(true)
                setType('success')
            },
            onError: (err) => {
                setMessage(err.message)
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setLoading(false)
            }
        })
    }

    const handleFetchNotarizationReservation = () => {
        if (!access) {
            setMessage('No hay sesión activa')
            setShow(true)
            setType('error')
            return
        }
        createNotarizationReservation.mutate(
            {
                access,
                notarizationReservation: {
                    kardex: kardex.kardex,
                    idtipkar: kardex.idtipkar,
                },
            },
            {
                onSuccess: (data) => {
                    setSignatumReservationId(data.id)
                    applyReservationToForm(data, kardex.idtipkar, {
                        setNumMinuta,
                        setNumEscritura,
                        setNumActa,
                        setFolioIni,
                        setFolioFin,
                        setSerieNotarialIni,
                        setSerieNotarialFin,
                        setFechaActa,
                        setFechaEscritura,
                        setFechaMinuta,
                    })
                    setErrorFechaActa('')
                    setErrorFechaEscritura('')
                    setErrorFechaMinuta('')
                    setErrorNumActa('')
                    setMessage('Datos de reserva cargados correctamente')
                    setShow(true)
                    setType('success')
                },
                onError: (err) => {
                    setMessage(err.message || 'No se pudo obtener la reserva de notarización')
                    setShow(true)
                    setType('error')
                },
            }
        )
    }

  return (
    <form 
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-6 w-full my-6">
            <div className=" w-[80%]">
                {(kardex.idtipkar === 1 || kardex.idtipkar === 5) && 
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
                        disabled
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <DateInput
                        label="Fecha de escritura"
                        value={fechaEscritura}
                        setValue={(v) => {
                            setFechaEscritura(v)
                            setFechaActa(v)
                            setErrorFechaEscritura('')
                            setErrorFechaActa('')
                        }}
                        horizontal
                        required
                        error={errorFechaEscritura}
                        setError={setErrorFechaEscritura}
                    />
                    <div />
                </div>
                </>
                }
                {kardex.idtipkar === 2 && 
                <>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={setNumMinuta}
                        value={numMinuta}
                        horizontal
                        label="N° de minuta/sol"
                    />
                    <SimpleInput 
                        setValue={setNumEscritura}
                        value={numEscritura}
                        horizontal
                        label="N° instrumento"
                        required
                        disabled
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <DateInput
                        label="Fecha minuta"
                        value={fechaMinuta}
                        setValue={(v) => {
                            setFechaMinuta(v)
                            setErrorFechaMinuta('')
                        }}
                        horizontal
                        error={errorFechaMinuta}
                        setError={setErrorFechaMinuta}
                    />
                    <div />
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
                        disabled
                    />
                </div>}
                {kardex.idtipkar === 4 && 
                <>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <div></div>
                    <SimpleInput 
                        setValue={setNumEscritura}
                        value={numEscritura}
                        horizontal
                        label="N° Acta"
                        disabled
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <DateInput
                        label="Fecha minuta"
                        value={fechaMinuta}
                        setValue={(v) => {
                            setFechaMinuta(v)
                            setErrorFechaMinuta('')
                        }}
                        horizontal
                        error={errorFechaMinuta}
                        setError={setErrorFechaMinuta}
                    />
                    <div />
                </div>
                </>
                }
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput
                        setValue={setFolioIni}
                        value={follioIni}
                        horizontal
                        label="N° de Folio del"
                        disabled
                    />
                    <div className="flex items-center gap-1.5">
                        <div className="min-w-0 flex-1">
                            <SimpleInput
                                setValue={setFolioFin}
                                value={folioFin}
                                horizontal
                                label="Al"
                            />
                        </div>
                        <FolioSerieIncDec
                            onInc={() => setFolioFin(incrementFolioSerieValue(folioFin))}
                            onDec={() => setFolioFin(decrementFolioSerieValue(folioFin))}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput
                        setValue={setSerieNotarialIni}
                        value={serieNotarialIni}
                        horizontal
                        label="Serie Notarial del"
                        disabled
                    />
                    <div className="flex items-center gap-1.5">
                        <div className="min-w-0 flex-1">
                            <SimpleInput
                                setValue={setSerieNotarialFin}
                                value={serieNotarialFin}
                                horizontal
                                label="Al"
                            />
                        </div>
                        <FolioSerieIncDec
                            onInc={() => setSerieNotarialFin(incrementFolioSerieValue(serieNotarialFin))}
                            onDec={() => setSerieNotarialFin(decrementFolioSerieValue(serieNotarialFin))}
                        />
                    </div>
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
                        setValue={
                            kardex.idtipkar === 1 || kardex.idtipkar === 5
                                ? (v) => {
                                      setFechaEscritura(v)
                                      setFechaActa(v)
                                      setErrorFechaEscritura('')
                                      setErrorFechaActa('')
                                  }
                                : (v) => {
                                      setFechaActa(v)
                                      setErrorFechaActa('')
                                  }
                        }
                        value={
                            kardex.idtipkar === 1 || kardex.idtipkar === 5
                                ? fechaEscritura
                                : fechaActa
                        }
                        horizontal
                        label="Fecha"
                        required
                        error={
                            kardex.idtipkar === 1 || kardex.idtipkar === 5
                                ? errorFechaEscritura
                                : errorFechaActa
                        }
                        setError={
                            kardex.idtipkar === 1 || kardex.idtipkar === 5
                                ? setErrorFechaEscritura
                                : setErrorFechaActa
                        }
                    />
                    <div className="flex items-center justify-start">
                    <button
                        className={`gap-1 px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center min-w-[120px] my-4 ${createNotarizationReservation.isPending ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
                        type="button"
                        onClick={handleFetchNotarizationReservation}
                        disabled={createNotarizationReservation.isPending}
                    >
                        {createNotarizationReservation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <p className="text-xs font-semibold">Obtener datos</p>
                        )}
                    </button>
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={handleClearEscrituracion}
                        className={`bg-red-600 ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-white text-xs px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300`}
                        disabled={loading}
                    >
                        Borrar
                    </button>
                    <button
                        className={`bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-white text-xs px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 `}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin text-white text-xs w-4 h-4" /> : 'Guardar'}
                    </button>
                </div>
            </div>

    </form>
  )
}

export default EscrituracionForm