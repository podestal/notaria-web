import { BrushCleaning, FileText, Loader2, Save } from "lucide-react"
import SingleSelect from "../../../ui/SingleSelect"
import { useEffect, useState } from "react"
import useAuthStore from "../../../../store/useAuthStore"
import useCreateRenta from "../../../../hooks/api/renta/useCreateRenta"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import { ContratantesPorActo } from "../../../../services/api/contratantesPorActoService"
import useUpdateRenta from "../../../../hooks/api/renta/useUpdateRenta"
import { Renta } from "../../../../services/api/rentaService"
import getTitleCase from "../../../../utils/getTitleCase"
import ParticipaFormularioForm from "./ParticipaFormularioForm"
import TopModal from "../../../ui/TopModal"

const options = [
    { value: '1', label: 'Sí' },
    { value: '0', label: 'No' },
]

const QUESTIONS = [
    {
        id: 'pregu1',
        number: 1,
        text: '¿La enajenación generó renta de 3ra categoría?',
    },
    {
        id: 'pregu2',
        number: 2,
        text: '¿El bien enajenado era la casa habitación del enajenante?',
    },
    {
        id: 'pregu3',
        number: 3,
        text: '¿El impuesto por pagar es cero?',
    },
] as const

interface Props {
    kardex: string
    contratante: ContratantesPorActo
}

const ParticipaRentaForm = ({ kardex, contratante }: Props) => {

    const [showFormulario, setShowFormulario] = useState(false)

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType} = useNotificationsStore()

    const [pregu1, setPregu1] = useState(contratante.renta?.pregu1 || '')
    const [pregu2, setPregu2] = useState(contratante.renta?.pregu2 || '')
    const [pregu3, setPregu3] = useState(contratante.renta?.pregu3 || '')

    const [pregu1Error, setPregu1Error] = useState(false)
    const [pregu2Error, setPregu2Error] = useState(false)
    const [pregu3Error, setPregu3Error] = useState(false)

    const [loading, setLoading] = useState(false)
    const [renta, setRenta] = useState<Renta | undefined>(contratante.renta)

    const createRenta = useCreateRenta({ kardex })
    const updateRenta = useUpdateRenta({ idrenta: renta?.idrenta || '', kardex })

    const [doneCreate, setDoneCreate] = useState(false)

    useEffect(() => {
        setRenta(contratante.renta)
        setPregu1(contratante.renta?.pregu1 || '')
        setPregu2(contratante.renta?.pregu2 || '')
        setPregu3(contratante.renta?.pregu3 || '')
    }, [contratante.renta])

    const questionState = {
        pregu1: { value: pregu1, set: setPregu1, error: pregu1Error, setError: setPregu1Error },
        pregu2: { value: pregu2, set: setPregu2, error: pregu2Error, setError: setPregu2Error },
        pregu3: { value: pregu3, set: setPregu3, error: pregu3Error, setError: setPregu3Error },
    }

    const handleLimpiarPreguntas = () => {
        setPregu1('')
        setPregu2('')
        setPregu3('')
        setPregu1Error(false)
        setPregu2Error(false)
        setPregu3Error(false)
    }

    const handleGrabar = () => {
        setPregu1Error(false)
        setPregu2Error(false)
        setPregu3Error(false)

        if (pregu1 === '') {
            setPregu1Error(true)
            return
        }
        if (pregu2 === '') {
            setPregu2Error(true)
            return
        }
        if (pregu3 === '') {
            setPregu3Error(true)
            return
        }

        setLoading(true)

        if (!contratante.renta?.idrenta && !doneCreate) {
            createRenta.mutate({
                access: access,
                renta: {
                    kardex: kardex,
                    idcontratante: contratante.idcontratante,
                    pregu1: pregu1,
                    pregu2: pregu2,
                    pregu3: pregu3,
                }
            }, {
                onSuccess: (res) => {
                    setMessage('Renta creada correctamente')
                    setShow(true)
                    setType('success')
                    setDoneCreate(true)
                    setRenta(res)
                },
                onError: () => {
                    setMessage('Error al crear la renta')
                    setShow(true)
                    setType('error')
                },
                onSettled: () => {
                    setLoading(false)
                }
            })
        }

        if (renta?.idrenta) {
            updateRenta.mutate({
                access: access,
                renta: {
                    ...renta,
                    pregu1: pregu1,
                    pregu2: pregu2,
                    pregu3: pregu3,
                }
            }, {
                onSuccess: () => {
                    setMessage('Renta actualizada correctamente')
                    setShow(true)
                    setType('success')
                },
                onError: () => {
                    setMessage('Error al actualizar la renta')
                    setShow(true)
                    setType('error')
                },
                onSettled: () => {
                    setLoading(false)
                }
            })
        }
    }

    return (
        <>
            <div className="mx-auto w-full max-w-3xl space-y-6">
                <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Renta — 3ra categoría
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-slate-900">
                            Datos de la renta
                        </h2>
                        <p className="mt-1.5 text-sm text-slate-600">
                            {getTitleCase(contratante.cliente || '')}
                        </p>
                        <p className="text-xs text-slate-400">
                            Kardex {kardex}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleLimpiarPreguntas}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <BrushCleaning className="h-4 w-4 text-sky-600" aria-hidden />
                        Limpiar preguntas
                    </button>
                </header>

                <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                    <p className="text-sm leading-relaxed text-slate-700">
                        Presentó comunicación con carácter de{' '}
                        <span className="font-semibold text-slate-900">DECLARACIÓN JURADA</span>
                        indicando:
                    </p>

                    <div className="mt-4 space-y-3">
                        {QUESTIONS.map((question) => {
                            const state = questionState[question.id]
                            return (
                                <div
                                    key={question.id}
                                    className={`rounded-lg border bg-white p-4 shadow-sm transition ${
                                        state.error
                                            ? 'border-rose-300 ring-1 ring-rose-100'
                                            : 'border-slate-200'
                                    }`}
                                >
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex min-w-0 gap-3">
                                            <span
                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700"
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
                                            name={question.id}
                                            options={options}
                                            selected={state.value}
                                            onChange={(value) => {
                                                state.set(value)
                                                state.setError(false)
                                            }}
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

                <footer className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
                    <button
                        type="button"
                        onClick={handleGrabar}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        ) : (
                            <Save className="h-4 w-4" aria-hidden />
                        )}
                        {loading ? 'Guardando…' : 'Grabar'}
                    </button>
                    {renta?.pregu3 === '0' && (
                        <button
                            type="button"
                            onClick={() => setShowFormulario(true)}
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
                        >
                            <FileText className="h-4 w-4" aria-hidden />
                            Ingresar formulario
                        </button>
                    )}
                </footer>
            </div>

            <TopModal
                isOpen={showFormulario}
                onClose={() => setShowFormulario(false)}
                portal
            >
                <ParticipaFormularioForm
                    idrenta={renta?.idrenta || ''}
                />
            </TopModal>
        </>
    )
}

export default ParticipaRentaForm
