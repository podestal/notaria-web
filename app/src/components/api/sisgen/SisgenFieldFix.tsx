import { useState, type ReactNode, type SetStateAction } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { CheckCircle2, ExternalLink, Loader2, PencilLine, Wrench } from "lucide-react"
import useGetCliente2ByContratante from "../../../hooks/api/cliente2/useGetCliente2ByContratante"
import useUpdateCliente2 from "../../../hooks/api/cliente2/useUpdateCliente2"
import useUpdatePatrimonial from "../../../hooks/api/patrimonial/useUpdatePatrimonial"
import useGetProfesiones from "../../../hooks/api/profesiones/useGetProfesiones"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useAuthStore from "../../../store/useAuthStore"
import { documentNaturalOptions, documentoJuridicaOptions } from "../../../data/clienteData"
import { FORMAS_PAGO, OPPORTUNIDADES_PAGO } from "../../../data/patrimonialData"
import type { Cliente2, CreateUpdateCliente2 } from "../../../services/api/clienteService"
import getPatrimonialService, { type PatrimonialCreateUpdate } from "../../../services/api/patrimonialService"
import type { SisgenFieldAction, SisgenKardexTab } from "../../../utils/sisgenSubmissionErrors"
import SearchableDropdownInput from "../../ui/SearchableDropdownInput"
import TopModal from "../../ui/TopModal"
import UpdateCliente2 from "../clientes2/UpdateCliente2"

type Action<T extends SisgenFieldAction["tipo"]> = Extract<SisgenFieldAction, { tipo: T }>

interface FixContext {
    kardex: string
    onSaved: () => void
    onResend?: () => void
}

const KARDEX_TAB_LABELS: Record<SisgenKardexTab, string> = {
    kardex: "Kardex",
    contratantes: "Contratantes",
    patrimonial: "UIF/PDT Patrimonial",
}

const QUICK_FIX_TYPES = new Set<SisgenFieldAction["tipo"]>([
    "cliente2_tipo_documento",
    "cliente2_profesion",
    "patrimonial_forma_pago",
    "patrimonial_oportunidad_pago",
])

const apiErrorMessage = (error: unknown): string => {
    const data = (error as { response?: { data?: unknown } })?.response?.data
    if (typeof data === "string" && data.trim()) return data
    if (data && typeof data === "object") {
        const parts = Object.values(data as Record<string, unknown>).flatMap((v) =>
            Array.isArray(v) ? v.map(String) : [String(v)],
        )
        if (parts.length) return parts.join(" ")
    }
    return "No se pudo guardar el cambio."
}

const inputClass =
    "w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-300 disabled:bg-slate-100 disabled:text-slate-400"

interface FixFormProps {
    children: ReactNode
    saving: boolean
    error: string
    disabled?: boolean
    onSave: (resend: boolean) => void
    canResend: boolean
}

const FixForm = ({ children, saving, error, disabled, onSave, canResend }: FixFormProps) => (
    <div className="mt-2 space-y-2 rounded-md border border-indigo-100 bg-indigo-50/60 p-2">
        {children}
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex flex-wrap justify-end gap-2">
            <button
                type="button"
                disabled={saving || disabled}
                onClick={() => onSave(false)}
                className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                Guardar
            </button>
            {canResend && (
                <button
                    type="button"
                    disabled={saving || disabled}
                    onClick={() => onSave(true)}
                    className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Guardar y reenviar
                </button>
            )}
        </div>
    </div>
)

const useFixNotifier = ({ onSaved, onResend }: FixContext) => {
    const { setMessage, setShow, setType } = useNotificationsStore()
    return (resend: boolean) => {
        setType("success")
        setMessage("Dato corregido")
        setShow(true)
        onSaved()
        if (resend) onResend?.()
    }
}

// --------------------------------------------------------------------------- cliente2 quick fixes

const validateNumdoc = (idtipdoc: number, numdoc: string): string => {
    if (!idtipdoc) return "Seleccione el tipo de documento."
    if (idtipdoc === 10) return ""
    if (!numdoc) return "Ingrese el número de documento."
    if (idtipdoc === 8 && !/^\d{11}$/.test(numdoc)) return "El RUC debe tener 11 dígitos."
    if (idtipdoc === 1 && !/^\d{8}$/.test(numdoc)) return "El DNI debe tener 8 dígitos."
    return ""
}

interface TipoDocumentoFormProps extends FixContext {
    idcontratante: string
    tipper: string
    initialIdtipdoc: number
    initialNumdoc: string
}

const TipoDocumentoForm = ({ idcontratante, tipper, initialIdtipdoc, initialNumdoc, ...ctx }: TipoDocumentoFormProps) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const updateCliente2 = useUpdateCliente2({ clienteId: idcontratante, kardex: ctx.kardex })
    const notifySaved = useFixNotifier(ctx)
    const options = (tipper === "J" ? documentoJuridicaOptions : documentNaturalOptions).filter((o) => o.value !== 0)
    const [idtipdoc, setIdtipdoc] = useState(options.some((o) => o.value === initialIdtipdoc) ? initialIdtipdoc : 0)
    const [numdoc, setNumdoc] = useState(initialNumdoc)
    const [error, setError] = useState("")

    const save = (resend: boolean) => {
        const cleanNumdoc = idtipdoc === 10 ? "" : numdoc.trim()
        const validation = validateNumdoc(idtipdoc, cleanNumdoc)
        if (validation) {
            setError(validation)
            return
        }
        setError("")
        updateCliente2.mutate(
            { access, cliente: { idtipdoc, numdoc: cleanNumdoc } as CreateUpdateCliente2 },
            { onSuccess: () => notifySaved(resend), onError: (err) => setError(apiErrorMessage(err)) },
        )
    }

    return (
        <FixForm saving={updateCliente2.isPending} error={error} onSave={save} canResend={!!ctx.onResend}>
            <div className="grid gap-2 sm:grid-cols-2">
                <label className="space-y-1 text-xs text-slate-600">
                    <span>Tipo de documento</span>
                    <select className={inputClass} value={idtipdoc} onChange={(e) => setIdtipdoc(Number(e.target.value))}>
                        <option value={0}>Seleccione</option>
                        {options.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="space-y-1 text-xs text-slate-600">
                    <span>Número de documento</span>
                    <input
                        className={inputClass}
                        value={idtipdoc === 10 ? "" : numdoc}
                        disabled={idtipdoc === 10}
                        placeholder={idtipdoc === 10 ? "No aplica" : ""}
                        onChange={(e) => setNumdoc(e.target.value)}
                    />
                </label>
            </div>
        </FixForm>
    )
}

const TipoDocumentoFix = ({ accion, ...ctx }: FixContext & { accion: Action<"cliente2_tipo_documento"> }) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data: cliente2, isLoading } = useGetCliente2ByContratante({ access, idcontratante: accion.idcontratante })
    if (isLoading) return <FixLoading />
    return (
        <TipoDocumentoForm
            {...ctx}
            idcontratante={accion.idcontratante}
            tipper={(cliente2?.tipper || accion.tipper || "").toUpperCase()}
            initialIdtipdoc={Number(cliente2?.idtipdoc ?? accion.idtipdoc ?? 0)}
            initialNumdoc={String(cliente2?.numdoc ?? accion.numdoc ?? "").trim()}
        />
    )
}

interface ProfesionOption {
    id: string
    label: string
}

const ProfesionForm = ({
    idcontratante,
    options,
    initial,
    ...ctx
}: FixContext & { idcontratante: string; options: ProfesionOption[]; initial: ProfesionOption | null }) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const updateCliente2 = useUpdateCliente2({ clienteId: idcontratante, kardex: ctx.kardex })
    const notifySaved = useFixNotifier(ctx)
    const [selected, setSelected] = useState<ProfesionOption | null>(initial)
    const [error, setError] = useState("")

    const save = (resend: boolean) => {
        if (!selected) {
            setError("Seleccione una profesión u ocupación.")
            return
        }
        setError("")
        updateCliente2.mutate(
            {
                access,
                cliente: { idprofesion: Number(selected.id), detaprofesion: selected.label } as CreateUpdateCliente2,
            },
            { onSuccess: () => notifySaved(resend), onError: (err) => setError(apiErrorMessage(err)) },
        )
    }

    return (
        <FixForm saving={updateCliente2.isPending} error={error} onSave={save} canResend={!!ctx.onResend}>
            <div className="space-y-1 text-xs text-slate-600">
                <span>Profesión / ocupación</span>
                <SearchableDropdownInput
                    options={options}
                    selected={selected}
                    setSelected={setSelected}
                    defaultValue={initial?.label}
                    placeholder="Buscar profesión"
                />
            </div>
        </FixForm>
    )
}

const ProfesionFix = ({ accion, ...ctx }: FixContext & { accion: Action<"cliente2_profesion"> }) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data: profesiones, isLoading } = useGetProfesiones({ access })
    const { data: cliente2, isLoading: isLoadingCliente } = useGetCliente2ByContratante({
        access,
        idcontratante: accion.idcontratante,
    })
    if (isLoading || isLoadingCliente) return <FixLoading />
    const options = (profesiones ?? []).map((p) => ({ id: String(p.idprofesion), label: p.desprofesion }))
    const currentId = String(cliente2?.idprofesion ?? accion.idprofesion ?? "")
    return (
        <ProfesionForm
            {...ctx}
            idcontratante={accion.idcontratante}
            options={options}
            initial={options.find((o) => o.id === currentId) ?? null}
        />
    )
}

// --------------------------------------------------------------------------- patrimonial quick fixes

const usePatrimonial = (itemmp: string) => {
    const access = useAuthStore((s) => s.access_token) || ""
    return useQuery({
        queryKey: ["patrimonial", itemmp],
        queryFn: () => getPatrimonialService({ idPatrimonial: itemmp }).get(access),
        enabled: !!itemmp,
    })
}

interface PatrimonialSelectFormProps extends FixContext {
    itemmp: string
    field: "fpago" | "idoppago"
    label: string
    options: { value: string; label: string }[]
    initial: string
}

const PatrimonialSelectForm = ({ itemmp, field, label, options, initial, ...ctx }: PatrimonialSelectFormProps) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const queryClient = useQueryClient()
    const updatePatrimonial = useUpdatePatrimonial({ idPatrimonial: itemmp })
    const notifySaved = useFixNotifier(ctx)
    const [value, setValue] = useState(options.some((o) => o.value === initial) ? initial : "")
    const [error, setError] = useState("")

    const save = (resend: boolean) => {
        if (!value) {
            setError(`Seleccione ${label.toLowerCase()}.`)
            return
        }
        setError("")
        updatePatrimonial.mutate(
            { access, patrimonial: { [field]: value } as unknown as PatrimonialCreateUpdate },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["patrimonial", itemmp] })
                    notifySaved(resend)
                },
                onError: (err) => setError(apiErrorMessage(err)),
            },
        )
    }

    return (
        <FixForm saving={updatePatrimonial.isPending} error={error} onSave={save} canResend={!!ctx.onResend}>
            <label className="block space-y-1 text-xs text-slate-600">
                <span>{label}</span>
                <select className={inputClass} value={value} onChange={(e) => setValue(e.target.value)}>
                    <option value="">Seleccione</option>
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </label>
        </FixForm>
    )
}

const FormaPagoFix = ({ accion, ...ctx }: FixContext & { accion: Action<"patrimonial_forma_pago"> }) => {
    const { data: patrimonial, isLoading } = usePatrimonial(accion.itemmp)
    if (isLoading) return <FixLoading />
    return (
        <PatrimonialSelectForm
            {...ctx}
            itemmp={accion.itemmp}
            field="fpago"
            label="Forma de pago"
            options={FORMAS_PAGO.map((f) => ({ value: f.id_fpago, label: f.descripcion }))}
            initial={String(patrimonial?.fpago ?? accion.fpago ?? "")}
        />
    )
}

const OportunidadPagoFix = ({ accion, ...ctx }: FixContext & { accion: Action<"patrimonial_oportunidad_pago"> }) => {
    const { data: patrimonial, isLoading } = usePatrimonial(accion.itemmp)
    if (isLoading) return <FixLoading />
    const sugerida = OPPORTUNIDADES_PAGO.find((o) => String(o.idoppago) === accion.sugerido)
    return (
        <>
            {sugerida && (
                <p className="mt-2 text-xs text-indigo-800">
                    Sugerido por SISGEN: <span className="font-semibold">{sugerida.desoppago}</span>
                </p>
            )}
            <PatrimonialSelectForm
                {...ctx}
                itemmp={accion.itemmp}
                field="idoppago"
                label="Oportunidad de pago"
                options={OPPORTUNIDADES_PAGO.map((o) => ({ value: String(o.idoppago), label: o.desoppago }))}
                initial={accion.sugerido || String(patrimonial?.idoppago ?? accion.idoppago ?? "")}
            />
        </>
    )
}

const FixLoading = () => (
    <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
        <Loader2 className="h-3 w-3 animate-spin" /> Cargando datos actuales...
    </p>
)

// --------------------------------------------------------------------------- edit contratante pop-up

interface EditarContratanteProps {
    idcontratante: string
    kardex: string
    onClose: (saved: boolean) => void
}

const EditarContratanteForm = ({ cliente2, kardex, onClose }: Omit<EditarContratanteProps, "idcontratante"> & { cliente2: Cliente2 }) => {
    const queryClient = useQueryClient()
    const [snapshot] = useState(() => JSON.stringify(cliente2))

    // Cliente2Form calls the same setters on save and on cancel; useUpdateCliente2 writes the
    // saved row into this query key, so a changed cache entry means it was saved.
    const handleShowClienteForm = (value: SetStateAction<boolean>) => {
        const next = typeof value === "function" ? value(true) : value
        if (next) return
        const current = queryClient.getQueryData<Cliente2>(["clientes2", cliente2.idcontratante])
        onClose(JSON.stringify(current ?? cliente2) !== snapshot)
    }

    return (
        <UpdateCliente2
            dni={cliente2.numdoc}
            cliente2={cliente2}
            kardex={kardex}
            setShowClienteForm={handleShowClienteForm}
            setShowContratanteForm={() => {}}
        />
    )
}

const EditarContratanteBody = ({ idcontratante, kardex, onClose }: EditarContratanteProps) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data: cliente2, isLoading, isError } = useGetCliente2ByContratante({ access, idcontratante })

    if (isLoading) return <FixLoading />
    if (isError || !cliente2) return <p className="text-xs text-red-600">No se pudo cargar el contratante.</p>
    return <EditarContratanteForm cliente2={cliente2} kardex={kardex} onClose={onClose} />
}

// --------------------------------------------------------------------------- public component

interface SisgenFieldFixProps {
    accion: SisgenFieldAction
    kardex: string
    onSaved: () => void
    onResend?: () => void
    onOpenKardex?: () => void
}

const SisgenFieldFix = ({ accion, kardex, onSaved, onResend, onOpenKardex }: SisgenFieldFixProps) => {
    const [open, setOpen] = useState(false)
    const [saved, setSaved] = useState(false)
    const queryClient = useQueryClient()

    const handleSaved = () => {
        setSaved(true)
        setOpen(false)
        onSaved()
    }

    if (saved) {
        return (
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Corregido
            </span>
        )
    }

    if (accion.tipo === "ir_kardex") {
        if (!onOpenKardex) return null
        return (
            <button
                type="button"
                onClick={onOpenKardex}
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
                <ExternalLink className="h-3 w-3" />
                Abrir kardex › {KARDEX_TAB_LABELS[accion.seccion] ?? "Kardex"}
            </button>
        )
    }

    if (accion.tipo === "editar_contratante") {
        return (
            <>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                    <PencilLine className="h-3 w-3" />
                    Editar contratante
                </button>
                <TopModal isOpen={open} onClose={() => setOpen(false)} portal>
                    <div className="p-5">
                        <EditarContratanteBody
                            idcontratante={accion.idcontratante}
                            kardex={kardex}
                            onClose={(wasSaved) => {
                                setOpen(false)
                                if (wasSaved) {
                                    queryClient.invalidateQueries({ queryKey: ["clientes2", accion.idcontratante] })
                                    handleSaved()
                                }
                            }}
                        />
                    </div>
                </TopModal>
            </>
        )
    }

    if (!QUICK_FIX_TYPES.has(accion.tipo)) return null
    const ctx: FixContext = { kardex, onSaved: handleSaved, onResend }

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
                <Wrench className="h-3 w-3" />
                {open ? "Cancelar" : "Corregir aquí"}
            </button>
            {open && accion.tipo === "cliente2_tipo_documento" && <TipoDocumentoFix accion={accion} {...ctx} />}
            {open && accion.tipo === "cliente2_profesion" && <ProfesionFix accion={accion} {...ctx} />}
            {open && accion.tipo === "patrimonial_forma_pago" && <FormaPagoFix accion={accion} {...ctx} />}
            {open && accion.tipo === "patrimonial_oportunidad_pago" && <OportunidadPagoFix accion={accion} {...ctx} />}
        </div>
    )
}

export default SisgenFieldFix
