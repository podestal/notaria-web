import { useState } from "react"
import SimpleInput from "../../../ui/SimpleInput"
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

        if (numOp.length === 0) {
            setNumOpError('El número de operación es requerido')
            return
        }

        if (monto.length === 0) {
            setMontoError('El monto es requerido')
            return
        }

        setIsLoading(true)

        createFormulario.mutate({
            access: access,
            formulario: {
                idrenta,
                numformu: numOp,
                monto: monto
            }
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
            }
        })
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <header className="border-b border-slate-200 pb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Formulario SUNAT
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    Ingresar formulario de renta
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Registre el número de operación y el monto del formulario presentado.
                </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800">
                        Nuevo formulario
                    </h3>
                    <div className="mt-4 flex flex-col gap-4">
                        <SimpleInput
                            value={numOp}
                            setValue={setNumOp}
                            label="N° Op. Sunat / N° de Orden"
                            horizontal
                            error={numOpError}
                            setError={setNumOpError}
                        />
                        <SimpleInput
                            value={monto}
                            setValue={setMonto}
                            label="Monto"
                            horizontal
                            error={montoError}
                            setError={setMontoError}
                        />
                        <button
                            type="button"
                            onClick={handleGrabar}
                            disabled={isLoading}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                            ) : (
                                <Plus className="h-4 w-4" aria-hidden />
                            )}
                            {isLoading ? 'Guardando…' : 'Agregar formulario'}
                        </button>
                    </div>
                </section>

                <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800">
                        Formularios registrados
                    </h3>
                    <div className="mt-4">
                        <ParticipaFormularioTable idrenta={idrenta} />
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ParticipaFormularioForm
