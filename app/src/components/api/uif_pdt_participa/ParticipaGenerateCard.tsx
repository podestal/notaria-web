import { useState, useCallback, useEffect } from "react"
import { debounce } from "lodash"
import { Loader2 } from "lucide-react"
import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import getTitleCase from "../../../utils/getTitleCase"
import useUpdateContratantePorActo from "../../../hooks/api/contratantesPorActo/useUpdateContratantePorActo"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import ParticipaRenta from "./renta/ParticipaRenta"

interface Props {
    contratante: ContratantesPorActo
    detalleActo: string
    monto?: string
    kardex: string
}

const ParticipaGenerateCard = ({ contratante, detalleActo, monto, kardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const [porcentaje, setPorcentaje] = useState(contratante.porcentaje || '')
    const [origenDeFondos, setOrigenDeFondos] = useState(getTitleCase(contratante.ofondo || '') || '')
    const [localMonto, setLocalMonto] = useState(contratante.monto || '')
    const [isUpdating, setIsUpdating] = useState(false)
    const [isSavingOrigen, setIsSavingOrigen] = useState(false)
    const updateContratantePorActo = useUpdateContratantePorActo({ kardex: contratante.kardex, id: contratante.id })
    const { setMessage, setShow, setType } = useNotificationsStore()

    useEffect(() => {
        setPorcentaje(contratante.porcentaje || '')
    }, [contratante.porcentaje])

    useEffect(() => {
        setLocalMonto(contratante.monto || '')
    }, [contratante.monto])

    useEffect(() => {
        setOrigenDeFondos(getTitleCase(contratante.ofondo || '') || '')
    }, [contratante.ofondo])

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

    const savedOrigen = getTitleCase(contratante.ofondo || '') || ''
    const isOrigenDirty = origenDeFondos !== savedOrigen

    const handleSaveOrigen = () => {
        if (!isOrigenDirty) return

        setIsSavingOrigen(true)
        updateContratantePorActo.mutate({
            access,
            contratantePorActo: {
                ...contratante,
                ofondo: origenDeFondos,
            },
        }, {
            onSuccess: () => {
                setMessage('Origen de fondos actualizado correctamente')
                setShow(true)
                setType('success')
            },
            onError: () => {
                setMessage('Error al actualizar el origen de fondos')
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setIsSavingOrigen(false)
            },
        })
    }

    const handleChangeMonto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setLocalMonto(newValue)
        debouncedUpdateMonto(newValue)
    }

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
                    {contratante.formulario === '1' && (
                        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5">
                            <ParticipaRenta kardex={kardex} contratante={contratante} />
                            <span className="text-xs font-medium text-slate-600">
                                Datos de renta
                            </span>
                        </div>
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
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                            id={`origen-${contratante.id}`}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:opacity-60 sm:flex-1"
                            value={origenDeFondos}
                            onChange={handleChangeOrigenDeFondos}
                            disabled={isSavingOrigen}
                            placeholder="Origen de fondos"
                            type="text"
                        />
                        <button
                            type="button"
                            onClick={handleSaveOrigen}
                            disabled={!isOrigenDirty || isSavingOrigen}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            {isSavingOrigen ? (
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                            ) : null}
                            {isSavingOrigen ? 'Guardando…' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>

            {(isUpdating || isSavingOrigen) && (
                <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500 animate-pulse">
                    Guardando…
                </p>
            )}
        </article>
    )
}

export default ParticipaGenerateCard
