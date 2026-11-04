import { useState, useCallback, useEffect } from "react"
import { debounce } from "lodash"
import { FileText, Loader2 } from "lucide-react"
import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import getTitleCase from "../../../utils/getTitleCase"
import useUpdateContratantePorActo from "../../../hooks/api/contratantesPorActo/useUpdateContratantePorActo"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import SingleSelect from "../../ui/SingleSelect"
import useCreateRenta from "../../../hooks/api/renta/useCreateRenta"
import useUpdateRenta from "../../../hooks/api/renta/useUpdateRenta"
import { Renta } from "../../../services/api/rentaService"
import TopModal from "../../ui/TopModal"
import ParticipaFormularioForm from "./renta/ParticipaFormularioForm"

interface Props {
    contratante: ContratantesPorActo
    detalleActo: string
    monto?: string
    kardex: string
}

const SI_NO_OPTIONS = [
    { value: '1', label: 'Sí' },
    { value: '0', label: 'No' },
]

const QUESTIONS = [
    {
        id: 'pregu1' as const,
        number: 1,
        text: '¿La enajenación generó renta de 3ra categoría?',
    },
    {
        id: 'pregu2' as const,
        number: 2,
        text: '¿El bien enajenado era la casa habitación del enajenante?',
    },
    {
        id: 'pregu3' as const,
        number: 3,
        text: '¿El impuesto por pagar es cero?',
    },
]

/** Defaults: No / No / Sí — formulario modal not required (pregu3 = Sí). */
const DEFAULT_PREGU1 = '0'
const DEFAULT_PREGU2 = '0'
const DEFAULT_PREGU3 = '1'

const rentaOrDefault = (value: string | undefined, fallback: string) =>
    value === '0' || value === '1' ? value : fallback

const ParticipaGenerateCard = ({ contratante, detalleActo, monto, kardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const [porcentaje, setPorcentaje] = useState(contratante.porcentaje || '')
    const [origenDeFondos, setOrigenDeFondos] = useState(getTitleCase(contratante.ofondo || '') || '')
    const [localMonto, setLocalMonto] = useState(contratante.monto || '')
    const [isUpdating, setIsUpdating] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const updateContratantePorActo = useUpdateContratantePorActo({ kardex: contratante.kardex, id: contratante.id })
    const { setMessage, setShow, setType } = useNotificationsStore()

    const needsRenta = String(contratante.formulario ?? '').trim() === '1'

    const [pregu1, setPregu1] = useState(rentaOrDefault(contratante.renta?.pregu1, DEFAULT_PREGU1))
    const [pregu2, setPregu2] = useState(rentaOrDefault(contratante.renta?.pregu2, DEFAULT_PREGU2))
    const [pregu3, setPregu3] = useState(rentaOrDefault(contratante.renta?.pregu3, DEFAULT_PREGU3))
    const [pregu1Error, setPregu1Error] = useState(false)
    const [pregu2Error, setPregu2Error] = useState(false)
    const [pregu3Error, setPregu3Error] = useState(false)
    const [renta, setRenta] = useState<Renta | undefined>(contratante.renta)
    const [showFormulario, setShowFormulario] = useState(false)
    const [formularioIdRenta, setFormularioIdRenta] = useState(contratante.renta?.idrenta || '')

    const createRenta = useCreateRenta({ kardex })
    const updateRenta = useUpdateRenta({ idrenta: renta?.idrenta || '', kardex })

    useEffect(() => {
        setPorcentaje(contratante.porcentaje || '')
    }, [contratante.porcentaje])

    useEffect(() => {
        setLocalMonto(contratante.monto || '')
    }, [contratante.monto])

    useEffect(() => {
        setOrigenDeFondos(getTitleCase(contratante.ofondo || '') || '')
    }, [contratante.ofondo])

    useEffect(() => {
        setRenta(contratante.renta)
        setPregu1(rentaOrDefault(contratante.renta?.pregu1, DEFAULT_PREGU1))
        setPregu2(rentaOrDefault(contratante.renta?.pregu2, DEFAULT_PREGU2))
        setPregu3(rentaOrDefault(contratante.renta?.pregu3, DEFAULT_PREGU3))
        if (contratante.renta?.idrenta) {
            setFormularioIdRenta(contratante.renta.idrenta)
        }
    }, [contratante.renta])

    const isValidPercentage = (value: string): boolean => {
        if (value === '') return true
        if (value === '.') return true
        const percentageRegex = /^(100(\.0{0,2})?|[0-9]?[0-9](\.[0-9]{0,2})?)$/
        return percentageRegex.test(value)
    }

    const getImporteTotal = (): number | null => {
        const importe = Number(monto)
        if (!Number.isFinite(importe) || importe <= 0) return null
        return importe
    }

    const debouncedUpdateMonto = useCallback(
        debounce(async (newMonto: string) => {
            try {
                setIsUpdating(true)
                const importeTotal = getImporteTotal()
                if (importeTotal === null) {
                    setMessage('No se puede calcular el porcentaje: el importe del acto es 0 o no está definido')
                    setShow(true)
                    setType('error')
                    return
                }
                const parsedMonto = Number(newMonto)
                const newPorcentaje = Number.isFinite(parsedMonto)
                    ? (parsedMonto / importeTotal) * 100
                    : 0
                if (!Number.isFinite(newPorcentaje)) {
                    setMessage('No se puede calcular el porcentaje con el monto ingresado')
                    setShow(true)
                    setType('error')
                    return
                }
                updateContratantePorActo.mutate({
                    access,
                    contratantePorActo: {
                        ...contratante,
                        monto: newMonto,
                        porcentaje: newPorcentaje.toFixed(2),
                    },
                }, {
                    onSuccess: (res) => {
                        setPorcentaje(res.porcentaje)
                        setMessage('Monto actualizado correctamente')
                        setShow(true)
                        setType('success')
                    },
                    onError: () => {
                        setMessage('Error al actualizar el porcentaje')
                        setShow(true)
                        setType('error')
                    },
                })
            } catch (error) {
                console.error('Error updating percentage:', error)
            } finally {
                setIsUpdating(false)
            }
        }, 700),
        [monto, contratante, access],
    )

    const debouncedUpdatePorcentaje = useCallback(
        debounce(async (newPorcentaje: string) => {
            try {
                setIsUpdating(true)
                const importeTotal = getImporteTotal()
                const parsedPorcentaje = Number(newPorcentaje)
                const newMonto =
                    importeTotal !== null && Number.isFinite(parsedPorcentaje)
                        ? (parsedPorcentaje / 100) * importeTotal
                        : 0
                updateContratantePorActo.mutate({
                    access,
                    contratantePorActo: {
                        ...contratante,
                        porcentaje: newPorcentaje,
                        monto: Number.isFinite(newMonto) ? newMonto.toFixed(2) : '0.00',
                    },
                }, {
                    onSuccess: (res) => {
                        setLocalMonto(res.monto)
                        setMessage('Porcentaje actualizado correctamente')
                        setShow(true)
                        setType('success')
                    },
                    onError: () => {
                        setMessage('Error al actualizar el porcentaje')
                        setShow(true)
                        setType('error')
                    },
                })
            } catch (error) {
                console.error('Error updating percentage:', error)
            } finally {
                setIsUpdating(false)
            }
        }, 700),
        [monto, contratante, access],
    )

    const handleChangePorcentaje = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        if (isValidPercentage(newValue)) {
            setPorcentaje(newValue)
            debouncedUpdatePorcentaje(newValue)
        }
    }

    const handleChangeOrigenDeFondos = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrigenDeFondos(e.target.value)
    }

    const handleChangeMonto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setLocalMonto(newValue)
        debouncedUpdateMonto(newValue)
    }

    const savedOrigen = getTitleCase(contratante.ofondo || '') || ''
    const isOrigenDirty = origenDeFondos !== savedOrigen

    const savedPregu1 = renta?.pregu1 ?? contratante.renta?.pregu1 ?? ''
    const savedPregu2 = renta?.pregu2 ?? contratante.renta?.pregu2 ?? ''
    const savedPregu3 = renta?.pregu3 ?? contratante.renta?.pregu3 ?? ''
    const isRentaDirty =
        needsRenta &&
        (pregu1 !== (savedPregu1 || '') ||
            pregu2 !== (savedPregu2 || '') ||
            pregu3 !== (savedPregu3 || ''))
    const canEnableGuardar = needsRenta ? isOrigenDirty || isRentaDirty : isOrigenDirty
    const missingPregu1 = needsRenta && pregu1 !== '0' && pregu1 !== '1'
    const missingPregu2 = needsRenta && pregu2 !== '0' && pregu2 !== '1'
    const missingPregu3 = needsRenta && pregu3 !== '0' && pregu3 !== '1'
    const questionsComplete = !missingPregu1 && !missingPregu2 && !missingPregu3
    const saveOrigen = isOrigenDirty
    const saveRenta = needsRenta && questionsComplete && (isRentaDirty || isOrigenDirty)
    const openFormularioModal = needsRenta && questionsComplete && pregu3 === '0'

    const questionState = {
        pregu1: { value: pregu1, set: setPregu1, error: pregu1Error, setError: setPregu1Error },
        pregu2: { value: pregu2, set: setPregu2, error: pregu2Error, setError: setPregu2Error },
        pregu3: { value: pregu3, set: setPregu3, error: pregu3Error, setError: setPregu3Error },
    }

    const persistOrigen = (): Promise<void> =>
        new Promise((resolve, reject) => {
            updateContratantePorActo.mutate({
                access,
                contratantePorActo: {
                    ...contratante,
                    ofondo: origenDeFondos,
                },
            }, {
                onSuccess: () => resolve(),
                onError: (err) => reject(err),
            })
        })

    const persistRenta = (): Promise<Renta> =>
        new Promise((resolve, reject) => {
            const payload = {
                kardex,
                idcontratante: contratante.idcontratante,
                pregu1,
                pregu2,
                pregu3,
            }

            if (renta?.idrenta) {
                updateRenta.mutate({
                    access,
                    renta: { ...renta, ...payload },
                }, {
                    onSuccess: (res) => {
                        setRenta(res)
                        resolve(res)
                    },
                    onError: (err) => reject(err),
                })
                return
            }

            createRenta.mutate({
                access,
                renta: payload,
            }, {
                onSuccess: (res) => {
                    setRenta(res)
                    resolve(res)
                },
                onError: (err) => reject(err),
            })
        })

    const handleGuardar = async () => {
        setPregu1Error(false)
        setPregu2Error(false)
        setPregu3Error(false)

        if (!canEnableGuardar) return

        if (needsRenta && !questionsComplete) {
            if (missingPregu1) setPregu1Error(true)
            if (missingPregu2) setPregu2Error(true)
            if (missingPregu3) setPregu3Error(true)
            setMessage('Complete las preguntas de renta antes de guardar')
            setShow(true)
            setType('error')
            return
        }

        setIsSaving(true)
        try {
            if (saveOrigen) {
                await persistOrigen()
            }

            let saved: Renta | undefined = renta
            if (saveRenta) {
                saved = await persistRenta()
            }

            const idForFormulario = saved?.idrenta || renta?.idrenta || formularioIdRenta
            if (idForFormulario) {
                setFormularioIdRenta(idForFormulario)
            }

            if (openFormularioModal && idForFormulario) {
                setShowFormulario(true)
            }

            if (saveOrigen && saveRenta) {
                setMessage('Origen de fondos y preguntas de renta guardados correctamente')
            } else if (saveOrigen) {
                setMessage('Origen de fondos actualizado correctamente')
            } else if (saveRenta) {
                setMessage('Preguntas de renta guardadas correctamente')
            } else {
                setMessage('Guardado correctamente')
            }
            setShow(true)
            setType('success')
        } catch {
            setMessage('Error al guardar los datos del participante')
            setShow(true)
            setType('error')
        } finally {
            setIsSaving(false)
        }
    }

    const idrentaForFormulario = formularioIdRenta || renta?.idrenta || ''
    const showFormularioButton = needsRenta && pregu3 === '0' && Boolean(idrentaForFormulario)

    return (
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {getTitleCase(detalleActo || '')}
                    </p>
                    <h4 className="mt-0.5 text-sm font-semibold text-slate-900">
                        {getTitleCase(contratante.cliente || '')}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                        {getTitleCase(contratante.condicion_str || '')}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                        UIF {contratante.uif}
                    </span>
                    {needsRenta && (
                        <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
                            Requiere renta
                        </span>
                    )}
                </div>
            </header>

            <div className="grid gap-4 p-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                        htmlFor={`porcentaje-${contratante.id}`}
                    >
                        Porcentaje
                    </label>
                    <input
                        id={`porcentaje-${contratante.id}`}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 text-center outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
                        value={porcentaje}
                        onChange={handleChangePorcentaje}
                        disabled={isUpdating}
                        placeholder="0.00"
                        type="text"
                        inputMode="decimal"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                        htmlFor={`monto-${contratante.id}`}
                    >
                        Monto
                    </label>
                    <input
                        id={`monto-${contratante.id}`}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 text-center outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
                        value={localMonto}
                        onChange={handleChangeMonto}
                        disabled={isUpdating}
                        placeholder="0.00"
                        type="text"
                        inputMode="decimal"
                    />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label
                        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                        htmlFor={`origen-${contratante.id}`}
                    >
                        Origen de fondos
                    </label>
                    <input
                        id={`origen-${contratante.id}`}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
                        value={origenDeFondos}
                        onChange={handleChangeOrigenDeFondos}
                        disabled={isSaving}
                        placeholder="Origen de fondos"
                        type="text"
                    />
                </div>
            </div>

            {needsRenta && (
                <section className="border-t border-slate-100 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Preguntas de renta
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        Presentó comunicación con carácter de{' '}
                        <span className="font-semibold text-slate-900">DECLARACIÓN JURADA</span>
                        indicando:
                    </p>
                    <div className="mt-3 space-y-2">
                        {QUESTIONS.map((question) => {
                            const state = questionState[question.id]
                            return (
                                <div
                                    key={question.id}
                                    className={`rounded-lg border bg-slate-50/80 p-3 transition ${
                                        state.error
                                            ? 'border-rose-300 ring-1 ring-rose-100'
                                            : 'border-slate-200'
                                    }`}
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex min-w-0 gap-2.5">
                                            <span
                                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[10px] font-bold text-sky-700"
                                                aria-hidden
                                            >
                                                {question.number}
                                            </span>
                                            <p className="text-sm leading-snug text-slate-700">
                                                {question.text}
                                            </p>
                                        </div>
                                        <SingleSelect
                                            compact
                                            name={`${question.id}-${contratante.id}`}
                                            options={SI_NO_OPTIONS}
                                            selected={state.value}
                                            onChange={(value) => {
                                                state.set(value)
                                                state.setError(false)
                                            }}
                                            disabled={isSaving}
                                        />
                                    </div>
                                    {state.error && (
                                        <p className="mt-2 text-xs font-medium text-rose-600">
                                            Esta pregunta es requerida
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            <footer className="flex flex-wrap items-center gap-3 border-t border-slate-100 px-4 py-3">
                <button
                    type="button"
                    onClick={handleGuardar}
                    disabled={!canEnableGuardar || isSaving}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : null}
                    {isSaving ? 'Guardando…' : 'Guardar'}
                </button>
                {showFormularioButton && (
                    <button
                        type="button"
                        onClick={() => setShowFormulario(true)}
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
                    >
                        <FileText className="h-4 w-4" aria-hidden />
                        Ingresar formulario
                    </button>
                )}
            </footer>

            {(isUpdating || isSaving) && (
                <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500 animate-pulse">
                    Guardando…
                </p>
            )}

            <TopModal
                isOpen={showFormulario}
                onClose={() => setShowFormulario(false)}
                portal
            >
                <ParticipaFormularioForm idrenta={idrentaForFormulario} />
            </TopModal>
        </article>
    )
}

export default ParticipaGenerateCard
