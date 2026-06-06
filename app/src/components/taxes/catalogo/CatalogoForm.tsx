import { FormEvent, useEffect, useMemo, useState } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetCodigosUnitarios from "../../../hooks/taxes/useGetCodigosUnitarios"
import useGetMonedas from "../../../hooks/taxes/moneda/useGetMonedas"
import useGetTiposIgv from "../../../hooks/taxes/tiposIgv/useGetTiposIgv"
import type {
    Catalog,
    CreateUpdateCatalog,
} from "../../../services/taxes/catalogService"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelector from "../../ui/SimpleSelector"
import {
    calcValorUnitarioFromPrecio,
    calcIgvFromPrecio,
    formValuesToCatalogPayload,
    resolveCatalogCodigoUnitarioId,
    IGV_PERCENT_LABEL,
    type CatalogoFormValues,
} from "./catalogoFormShared"

interface Props {
    initialValues: CatalogoFormValues
    catalog?: Catalog
    onSubmit: (values: CreateUpdateCatalog) => Promise<void> | void
    submitLabel: string
    loading?: boolean
    onCancel?: () => void
}

const CatalogoForm = ({
    initialValues,
    catalog,
    onSubmit,
    submitLabel,
    loading = false,
    onCancel,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data: codigosUnitarios = [], isLoading: loadingCodigos } =
        useGetCodigosUnitarios({ access })
    const { data: tiposIgv = [], isLoading: loadingTiposIgv } =
        useGetTiposIgv({ access })
    const { data: monedas = [], isLoading: loadingMonedas } =
        useGetMonedas({ access })

    const [form, setForm] = useState<CatalogoFormValues>(initialValues)
    const [codigoError, setCodigoError] = useState("")
    const [descripcionError, setDescripcionError] = useState("")
    const [tipoError, setTipoError] = useState("")
    const [tipoIgvError, setTipoIgvError] = useState("")
    const [monedaError, setMonedaError] = useState("")
    const [precioError, setPrecioError] = useState("")

    const withPlaceholder = (options: { value: number; label: string }[]) => [
        { value: 0, label: "Seleccione…" },
        ...options,
    ]

    const tipoOptions = useMemo(
        () =>
            withPlaceholder(
                codigosUnitarios.map((item) => ({
                    value: item.id_codigo_unitario,
                    label: item.descripcion,
                })),
            ),
        [codigosUnitarios],
    )

    const tipoIgvOptions = useMemo(
        () =>
            withPlaceholder(
                tiposIgv.map((item) => ({
                    value: item.id_tipo_igv,
                    label: item.descripcion,
                })),
            ),
        [tiposIgv],
    )

    const monedaOptions = useMemo(
        () =>
            withPlaceholder(
                monedas.map((item) => ({
                    value: item.id_moneda,
                    label: item.descripcion,
                })),
            ),
        [monedas],
    )

    const loadingOptions = loadingCodigos || loadingTiposIgv || loadingMonedas

    const igvAmount = useMemo(
        () => calcIgvFromPrecio(form.precio_unitario),
        [form.precio_unitario],
    )

    useEffect(() => {
        const id_codigo_unitario = catalog
            ? resolveCatalogCodigoUnitarioId(catalog, codigosUnitarios)
            : initialValues.id_codigo_unitario

        setForm({
            ...initialValues,
            id_codigo_unitario:
                id_codigo_unitario || initialValues.id_codigo_unitario,
            valor_unitario: calcValorUnitarioFromPrecio(
                initialValues.precio_unitario,
            ),
        })
    }, [initialValues, codigosUnitarios, catalog])

    const validate = () => {
        let ok = true
        if (form.id_codigo_unitario <= 0) {
            setTipoError("Seleccione un tipo")
            ok = false
        }
        if (form.tipo_igv_id <= 0) {
            setTipoIgvError("Seleccione un tipo IGV")
            ok = false
        }
        if (form.moneda_id <= 0) {
            setMonedaError("Seleccione una moneda")
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
                    key={`tipo-${form.id_codigo_unitario}-${tipoOptions.length}`}
                    label="Tipo"
                    options={tipoOptions}
                    defaultValue={form.id_codigo_unitario}
                    setter={(value) => {
                        setForm((prev) => ({ ...prev, id_codigo_unitario: value }))
                        setTipoError("")
                    }}
                    error={tipoError}
                    required
                    disabled={tipoOptions.length <= 1}
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
            {loadingTiposIgv ? (
                <p className="text-xs text-slate-500 animate-pulse">
                    Cargando tipos IGV…
                </p>
            ) : (
                <SimpleSelector
                    label="Tipo IGV"
                    options={tipoIgvOptions}
                    defaultValue={form.tipo_igv_id}
                    setter={(value) => {
                        setForm((prev) => ({ ...prev, tipo_igv_id: value }))
                        setTipoIgvError("")
                    }}
                    error={tipoIgvError}
                    required
                    disabled={tipoIgvOptions.length <= 1}
                />
            )}
            {loadingMonedas ? (
                <p className="text-xs text-slate-500 animate-pulse">
                    Cargando monedas…
                </p>
            ) : (
                <SimpleSelector
                    label="Moneda"
                    options={monedaOptions}
                    defaultValue={form.moneda_id}
                    setter={(value) => {
                        setForm((prev) => ({ ...prev, moneda_id: value }))
                        setMonedaError("")
                    }}
                    error={monedaError}
                    required
                    disabled={monedaOptions.length <= 1}
                />
            )}
            <SimpleInput
                label="Precio (con IGV)"
                type="number"
                value={form.precio_unitario}
                setValue={(value) => {
                    setForm((prev) => ({
                        ...prev,
                        precio_unitario: value,
                        valor_unitario: calcValorUnitarioFromPrecio(value),
                    }))
                    setPrecioError("")
                }}
                error={precioError}
                required
                horizontal
            />
            <SimpleInput
                label="Valor unitario (sin IGV)"
                type="number"
                value={form.valor_unitario}
                setValue={() => {}}
                disabled
                required
                horizontal
            />
            <SimpleInput
                label={IGV_PERCENT_LABEL}
                type="number"
                value={igvAmount}
                setValue={() => {}}
                disabled
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
                    disabled={loading || loadingOptions}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Guardando…" : submitLabel}
                </button>
            </div>
        </form>
    )
}

export default CatalogoForm
