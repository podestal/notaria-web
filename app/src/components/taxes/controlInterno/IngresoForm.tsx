import { FormEvent, useEffect, useMemo, useState } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetSeriesControlInterno from "../../../hooks/taxes/series/useGetSeriesControlInterno"
import type { CreateUpdateIngreso } from "../../../services/taxes/ingresosService"
import SimpleSelector from "../../ui/SimpleSelector"
import {
    formValuesToIngresoPayload,
    type IngresoFormValues,
} from "./ingresoFormShared"

interface Props {
    initialValues: IngresoFormValues
    onSubmit: (values: CreateUpdateIngreso) => Promise<void> | void
    submitLabel: string
    loading?: boolean
    onCancel?: () => void
}

const IngresoForm = ({
    initialValues,
    onSubmit,
    submitLabel,
    loading = false,
    onCancel,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data: series = [], isLoading: loadingSeries } = useGetSeriesControlInterno({
        access,
    })

    const [form, setForm] = useState<IngresoFormValues>(initialValues)
    const [serieError, setSerieError] = useState("")

    const serieOptions = useMemo(
        () => [
            { value: 0, label: "Seleccione…" },
            ...series.map((item) => ({
                value: item.id_serie,
                label: item.serie,
            })),
        ],
        [series],
    )

    useEffect(() => {
        setForm(initialValues)
    }, [initialValues])

    const validate = () => {
        let ok = true
        if (form.id_serie <= 0) {
            setSerieError("Seleccione una serie")
            ok = false
        }
        return ok
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validate()) return
        await onSubmit(formValuesToIngresoPayload(form))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {loadingSeries ? (
                <p className="text-xs text-slate-500 animate-pulse">
                    Cargando series…
                </p>
            ) : (
                <SimpleSelector
                    key={`serie-${form.id_serie}-${serieOptions.length}`}
                    label="Serie"
                    options={serieOptions}
                    defaultValue={form.id_serie}
                    setter={(value) => {
                        setForm((prev) => ({ ...prev, id_serie: value }))
                        setSerieError("")
                    }}
                    error={serieError}
                    required
                    disabled={serieOptions.length <= 1}
                />
            )}

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading || loadingSeries}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Guardando…" : submitLabel}
                </button>
            </div>
        </form>
    )
}

export default IngresoForm
