import { FormEvent, useEffect, useMemo, useState } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetCodigosUnitarios from "../../../hooks/taxes/useGetCodigosUnitarios"
import type { CreateUpdateCatalog } from "../../../services/taxes/catalogService"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelector from "../../ui/SimpleSelector"
import {
    CATALOGO_MONEDA_OPTIONS,
    CATALOGO_TIPO_IGV_OPTIONS,
    formValuesToCatalogPayload,
    type CatalogoFormValues,
} from "./catalogoFormShared"

interface Props {
    initialValues: CatalogoFormValues
    onSubmit: (values: CreateUpdateCatalog) => Promise<void> | void
    submitLabel: string
    loading?: boolean
    onCancel?: () => void
}

const CatalogoForm = ({
    initialValues,
    onSubmit,
    submitLabel,
    loading = false,
    onCancel,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data: codigosUnitarios = [], isLoading: loadingCodigos } =
        useGetCodigosUnitarios({ access })

    const [form, setForm] = useState<CatalogoFormValues>(initialValues)
    const [codigoError, setCodigoError] = useState("")
    const [descripcionError, setDescripcionError] = useState("")
    const [tipoError, setTipoError] = useState("")
    const [valorError, setValorError] = useState("")
    const [precioError, setPrecioError] = useState("")

    const tipoOptions = useMemo(
        () =>
            codigosUnitarios.map((item) => ({
                value: item.id_codigo_unitario,
                label: item.descripcion,
            })),
        [codigosUnitarios],
    )

    useEffect(() => {
        setForm(initialValues)
    }, [initialValues])

    const isInvalid = useMemo(
        () =>
            !form.id_codigo_unitario
            || !form.codigo.trim()
            || !form.descripcion.trim()
            || !form.valor_unitario.trim()
            || !form.precio_unitario.trim(),
        [form],
    )

    const validate = () => {
        let ok = true
        if (!form.id_codigo_unitario) {
            setTipoError("Seleccione un tipo")
            ok = false
        }
        if (!form.codigo.trim()) {
            setCodigoError("El código es obligatorio")
            ok = false
        }
        if (!form.descripcion.trim()) {
            setDescripcionError("El nombre es obligatorio")
            ok = false
        }
        if (!form.valor_unitario.trim() || Number.isNaN(Number(form.valor_unitario))) {
            setValorError("Ingrese un valor unitario válido")
            ok = false
        }
        if (!form.precio_unitario.trim() || Number.isNaN(Number(form.precio_unitario))) {
            setPrecioError("Ingrese un precio válido")
            ok = false
        }
        return ok
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validate()) return
        await onSubmit(formValuesToCatalogPayload(form))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {loadingCodigos ? (
                <p className="text-xs text-slate-500 animate-pulse">
                    Cargando tipos…
                </p>
            ) : (
                <SimpleSelector
                    label="Tipo"
                    options={tipoOptions}
                    defaultValue={form.id_codigo_unitario || undefined}
                    setter={(value) => {
                        setForm((prev) => ({ ...prev, id_codigo_unitario: value }))
                        setTipoError("")
                    }}
                    error={tipoError}
                    required
                    disabled={tipoOptions.length === 0}
                />
            )}
            <SimpleInput
                label="Código"
                value={form.codigo}
                setValue={(value) => {
                    setForm((prev) => ({ ...prev, codigo: value }))
                    setCodigoError("")
                }}
                error={codigoError}
                required
                horizontal
            />
            <SimpleInput
                label="Nombre producto / servicio"
                value={form.descripcion}
                setValue={(value) => {
                    setForm((prev) => ({ ...prev, descripcion: value }))
                    setDescripcionError("")
                }}
                error={descripcionError}
                required
                horizontal
            />
            <SimpleSelector
                label="Tipo IGV"
                options={CATALOGO_TIPO_IGV_OPTIONS}
                defaultValue={form.tipo_igv_id}
                setter={(value) =>
                    setForm((prev) => ({ ...prev, tipo_igv_id: value }))
                }
                required
            />
            <SimpleSelector
                label="Moneda"
                options={CATALOGO_MONEDA_OPTIONS}
                defaultValue={form.moneda_id}
                setter={(value) =>
                    setForm((prev) => ({ ...prev, moneda_id: value }))
                }
                required
            />
            <SimpleInput
                label="Valor unitario"
                type="number"
                value={form.valor_unitario}
                setValue={(value) => {
                    setForm((prev) => ({ ...prev, valor_unitario: value }))
                    setValorError("")
                }}
                error={valorError}
                required
                horizontal
            />
            <SimpleInput
                label="Precio"
                type="number"
                value={form.precio_unitario}
                setValue={(value) => {
                    setForm((prev) => ({ ...prev, precio_unitario: value }))
                    setPrecioError("")
                }}
                error={precioError}
                required
                horizontal
            />

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
                    disabled={loading || loadingCodigos || isInvalid}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Guardando…" : submitLabel}
                </button>
            </div>
        </form>
    )
}

export default CatalogoForm
