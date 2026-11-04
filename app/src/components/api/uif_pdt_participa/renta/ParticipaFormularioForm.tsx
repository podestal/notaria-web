import { useState } from "react"
import ParticipaFormularioTable from "./ParticipaFormularioTable"
import useCreateFormulario from "../../../../hooks/api/formulario/useCreateFormulario"
import useAuthStore from "../../../../store/useAuthStore"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import { Loader2, Plus } from "lucide-react"

interface Props {
    idrenta: string
}

const ParticipaFormularioForm = ({ idrenta }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } = useNotificationsStore()

    const [numOp, setNumOp] = useState('')
    const [monto, setMonto] = useState('')
    const createFormulario = useCreateFormulario({ idrenta })

    const [numOpError, setNumOpError] = useState('')
    const [montoError, setMontoError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleGrabar = () => {
        setNumOpError('')
        setMontoError('')

        if (!idrenta) {
            setMessage('Guarde las preguntas de renta antes de registrar el formulario')
            setShow(true)
            setType('error')
            return
        }

        if (numOp.trim().length === 0) {
            setNumOpError('El número de operación es requerido')
            return
        }

        if (monto.trim().length === 0) {
            setMontoError('El monto es requerido')
            return
        }

        setIsLoading(true)

        createFormulario.mutate({
            access,
            formulario: {
                idrenta,
                numformu: numOp.trim(),
                monto: monto.trim(),
            },
        }, {
            onSuccess: () => {
                setMessage('Formulario creado correctamente')
                setShow(true)
                setType('success')
                setNumOp('')
                setMonto('')
            },
            onError: () => {
                setMessage('Error al crear el formulario')
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setIsLoading(false)
            },
        })
    }

    if (!idrenta) {
        return (
            <div className="mx-auto w-full max-w-2xl py-8 text-center">
                <p className="text-sm font-medium text-slate-700">
                    Aún no hay una renta guardada
                </p>
                <p className="mt-1 text-xs text-slate-500">
                    Pulse Guardar en el participante para crear la renta y luego registre el formulario.
                </p>
            </div>
        )
    }

    return (
        <div className="mx-auto w-full max-w-2xl space-y-5">
            <header className="border-b border-slate-200 pb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Formulario SUNAT
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    Ingresar formulario de renta
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Registre el número de operación y el monto del formulario presentado.
                </p>
            </header>

            <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Nuevo formulario
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor={`numop-${idrenta}`}
                            className="text-xs font-semibold text-slate-600"
                        >
                            N° Op. Sunat / N° de Orden
                        </label>
                        <input
                            id={`numop-${idrenta}`}
                            type="text"
                            value={numOp}
                            onChange={(e) => {
                                setNumOpError('')
                                setNumOp(e.target.value)
                            }}
                            disabled={isLoading}
                            placeholder="Número de operación"
                            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 disabled:opacity-60 ${
                                numOpError
                                    ? 'border-rose-400 focus:ring-rose-100'
                                    : 'border-slate-200 focus:border-sky-400 focus:ring-sky-100'
                            }`}
                        />
                        {numOpError ? (
                            <p className="text-xs font-medium text-rose-600">{numOpError}</p>
                        ) : null}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor={`monto-form-${idrenta}`}
                            className="text-xs font-semibold text-slate-600"
                        >
                            Monto
                        </label>
                        <input
                            id={`monto-form-${idrenta}`}
                            type="text"
                            inputMode="decimal"
                            value={monto}
                            onChange={(e) => {
                                setMontoError('')
                                setMonto(e.target.value)
                            }}
                            disabled={isLoading}
                            placeholder="0.00"
                            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 disabled:opacity-60 ${
                                montoError
                                    ? 'border-rose-400 focus:ring-rose-100'
                                    : 'border-slate-200 focus:border-sky-400 focus:ring-sky-100'
                            }`}
                        />
                        {montoError ? (
                            <p className="text-xs font-medium text-rose-600">{montoError}</p>
                        ) : null}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleGrabar}
                    disabled={isLoading}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                        <Plus className="h-4 w-4" aria-hidden />
                    )}
                    {isLoading ? 'Guardando…' : 'Agregar formulario'}
                </button>
            </section>

            <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Formularios registrados
                </h3>
                <ParticipaFormularioTable idrenta={idrenta} />
            </section>
        </div>
    )
}

export default ParticipaFormularioForm
