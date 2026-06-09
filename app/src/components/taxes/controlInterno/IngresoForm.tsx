import { FormEvent, useEffect, useMemo, useState } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetMonedas from "../../../hooks/taxes/moneda/useGetMonedas"
import useGetSeriesControlInterno from "../../../hooks/taxes/series/useGetSeriesControlInterno"
import type { CreateUpdateIngreso } from "../../../services/taxes/ingresosService"
import type { Persona } from "../../../services/taxes/personasService"
import CreatePersona from "../personas/CreatePersona"
import { emptyPersonaFormValues } from "../personas/personaFormShared"
import TopModal from "../../ui/TopModal"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelector from "../../ui/SimpleSelector"
import IngresoLineasLooker from "./IngresoLineasLooker"
import IngresoPersonaLooker from "./IngresoPersonaLooker"
import {
    applyIngresoFormDefaults,
    computeIngresoTotalFromLineas,
    formValuesToIngresoPayload,
    resolveDefaultMonedaId,
    resolveDefaultSerieId,
    type IngresoFormValues,
} from "./ingresoFormShared"

interface Props {
    initialValues: IngresoFormValues
    onSubmit: (values: CreateUpdateIngreso) => Promise<void> | void
    submitLabel: string
    loading?: boolean
    onCancel?: () => void
    anulada?: boolean
    canjeada?: boolean
}

const IngresoForm = ({
    initialValues,
    onSubmit,
    submitLabel,
    loading = false,
    onCancel,
    anulada = false,
    canjeada = false,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""

    const { data: series = [], isLoading: loadingSeries } = useGetSeriesControlInterno({
        access,
    })
    const { data: monedas = [], isLoading: loadingMonedas } = useGetMonedas({ access })

    const [form, setForm] = useState<IngresoFormValues>(initialValues)
    const [serieError, setSerieError] = useState("")
    const [monedaError, setMonedaError] = useState("")
    const [personaDocumentoError, setPersonaDocumentoError] = useState("")
    const [direccionError, setDireccionError] = useState("")
    const [lineasError, setLineasError] = useState("")
    const [openCreatePersonaModal, setOpenCreatePersonaModal] = useState(false)
    const [personaFormSeed, setPersonaFormSeed] = useState(emptyPersonaFormValues)

    const defaultSerieId = useMemo(() => resolveDefaultSerieId(series), [series])
    const defaultMonedaId = useMemo(() => resolveDefaultMonedaId(monedas), [monedas])

    const serieOptions = useMemo(() => {
        const items = series.map((item) => ({
            value: item.id_serie,
            label: item.serie,
        }))

        if (items.length === 0) {
            return [{ value: 0, label: "Seleccione…" }]
        }

        if (defaultSerieId > 0) {
            return items
        }

        return [{ value: 0, label: "Seleccione…" }, ...items]
    }, [series, defaultSerieId])

    const monedaOptions = useMemo(() => {
        const items = monedas.map((item) => ({
            value: item.id_moneda,
            label: item.descripcion,
        }))

        if (items.length === 0) {
            return [{ value: 0, label: "Seleccione…" }]
        }

        if (defaultMonedaId > 0) {
            return items
        }

        return [{ value: 0, label: "Seleccione…" }, ...items]
    }, [monedas, defaultMonedaId])

    useEffect(() => {
        setForm(applyIngresoFormDefaults(initialValues, series, monedas))
    }, [initialValues, series, monedas])

    const applyPersonaLookup = (persona: Persona) => {
        setForm((prev) => ({
            ...prev,
            persona_id: persona.id_persona,
            persona_nombre: persona.nombre_completo,
            persona_documento: persona.numero_documento || prev.persona_documento,
            direccion: persona.direccion || prev.direccion,
        }))
        setPersonaDocumentoError("")
        setDireccionError("")
    }

    const openCreatePersonaForm = (query: string) => {
        const trimmed = query.trim()
        const documento = /^\d+$/.test(trimmed) ? trimmed : ""
        setPersonaFormSeed({
            ...emptyPersonaFormValues,
            numero_documento: documento,
        })
        setOpenCreatePersonaModal(true)
    }

    const handlePersonaCreated = (persona: Persona) => {
        applyPersonaLookup(persona)
        setOpenCreatePersonaModal(false)
    }

    const handlePersonaQueryChange = () => {
        setForm((prev) => ({
            ...prev,
            persona_id: 0,
            persona_nombre: "",
        }))
        setPersonaDocumentoError("")
    }

    const validate = () => {
        let ok = true

        if (form.id_serie <= 0) {
            setSerieError("Seleccione una serie")
            ok = false
        }
        if (form.moneda_id <= 0) {
            setMonedaError("Seleccione una moneda")
            ok = false
        }
        if (form.persona_id <= 0) {
            setPersonaDocumentoError("Busque y seleccione una persona")
            ok = false
        }
        if (!form.direccion.trim()) {
            setDireccionError("La dirección es obligatoria")
            ok = false
        }
        if (form.lineas.length === 0) {
            setLineasError("Agregue al menos un concepto del catálogo")
            ok = false
        }

        return ok
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validate()) return
        await onSubmit(
            formValuesToIngresoPayload(
                applyIngresoFormDefaults(form, series, monedas),
                series,
                { anulada, canjeada },
            ),
        )
    }

    const loadingOptions = loadingSeries || loadingMonedas

    return (
        <>
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
                    defaultValue={form.id_serie > 0 ? form.id_serie : defaultSerieId}
                    setter={(value) => {
                        setForm((prev) => ({ ...prev, id_serie: value }))
                        setSerieError("")
                    }}
                    error={serieError}
                    required
                    disabled={series.length <= 1}
                />
            )}

            {loadingMonedas ? (
                <p className="text-xs text-slate-500 animate-pulse">
                    Cargando monedas…
                </p>
            ) : (
                <SimpleSelector
                    key={`moneda-${form.moneda_id}-${monedaOptions.length}`}
                    label="Moneda"
                    options={monedaOptions}
                    defaultValue={form.moneda_id > 0 ? form.moneda_id : defaultMonedaId}
                    setter={(value) => {
                        setForm((prev) => ({ ...prev, moneda_id: value }))
                        setMonedaError("")
                    }}
                    error={monedaError}
                    required
                    disabled={monedas.length <= 1}
                />
            )}

            <IngresoPersonaLooker
                personaId={form.persona_id}
                personaDocumento={form.persona_documento}
                personaNombre={form.persona_nombre}
                onSelect={applyPersonaLookup}
                onQueryChange={handlePersonaQueryChange}
                onCreateRequest={openCreatePersonaForm}
                error={personaDocumentoError}
            />

            <SimpleInput
                label="Dirección"
                value={form.direccion}
                setValue={(value) => {
                    setForm((prev) => ({ ...prev, direccion: value }))
                    setDireccionError("")
                }}
                error={direccionError}
                required
                horizontal
            />

            <IngresoLineasLooker
                lineas={form.lineas}
                observaciones={form.observaciones}
                onObservacionesChange={(observaciones) => {
                    setForm((prev) => ({ ...prev, observaciones }))
                }}
                onChange={(lineas) => {
                    setForm((prev) => ({
                        ...prev,
                        lineas,
                        total: computeIngresoTotalFromLineas(lineas),
                    }))
                    setLineasError("")
                }}
                error={lineasError}
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

        <TopModal
            isOpen={openCreatePersonaModal}
            onClose={() => setOpenCreatePersonaModal(false)}
            portal
            deepth={50}
        >
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800">Registrar persona</h3>
                <p className="mt-1 text-xs text-slate-500">
                    No se encontró la persona. Complete los datos para registrarla y continuar
                    con el ingreso.
                </p>
                <div className="mt-4">
                    <CreatePersona
                        key={personaFormSeed.numero_documento}
                        initialValues={personaFormSeed}
                        onCreated={handlePersonaCreated}
                        onCancel={() => setOpenCreatePersonaModal(false)}
                    />
                </div>
            </div>
        </TopModal>
        </>
    )
}

export default IngresoForm
