import { CalendarDays, FileText, Scale, Sparkles, Users } from "lucide-react"
import useKardexTypesStore from "../../../hooks/store/useKardexTypesStore"
import getTitleCase from "../../../utils/getTitleCase"
import { useEffect, useMemo, useState } from "react"
import Calendar from "../../ui/Calendar"
import useGetTipoActo from "../../../hooks/api/tipoActo/useGetTipoActo"
import SearchableDropdownInput from "../../ui/SearchableDropdownInput"
import useGetUsuarios from "../../../hooks/api/usuarios/useGetUsuarios"
import { getUsuarioDisplayName } from "../../../services/api/usuariosService"
import useGetAbogados from "../../../hooks/api/abogados/useGetAbogados"
import { CreateKardexData } from "../../../hooks/api/kardex/useCreateKardex"
import { Kardex } from "../../../services/api/kardexService"
import { UseMutationResult } from "@tanstack/react-query"
import useBodyRenderStore from "../../../hooks/store/bodyRenderStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import KardexFormTabs from "./KardexFormTabs"
import ContratantesMain from "../contratantes/ContratantesMain"
import PatrimonialMain from "../uif_pdt_patrimonial/PatrimonialMain"
import MultiSelect from "../../ui/MultiSelect"
import { AnimatePresence, motion } from "framer-motion"
import KardexActosSelector from "./KardexActosSelector"
import getTipoActoIdArray from "../../../utils/getTipoActoIdArray"
import useUpdateKardex, { UpdateKardexData } from "../../../hooks/api/kardex/useUpdateKardex"
import TopModal from "../../ui/TopModal"
import ExplanationMessage from "../../ui/ExplanationMessage"
import ParticipaMain from "../uif_pdt_participa/ParticipaMain"
import useAuthStore from "../../../store/useAuthStore"
import useGetTemplatesByActos from "../../../hooks/api/templates/useGetTemplatesByActos"
import DigitacionMain from "../digitacion/DigitacionMain"
import EscrituracionMain from "../escrituracion/EscrituracionMain"
import KardexFacturacionMain from "./facturacion/KardexFacturacionMain"
import { isFacturacionEnabled } from "../../../utils/isFacturacionEnabled"
import useUserInfoStore from "../../../hooks/store/useGetUserInfo"
import { CreateUpdateKardex } from "../../../services/api/kardexService"
import {
    formatKardexFechaIngreso,
    parseDisplayDate,
} from "../../../utils/formatLocalDate"

const getFacturacionTab = (kardex: Kardex) =>
    isFacturacionEnabled()
        ? [{
            id: "facturacion",
            label: "Facturación",
            content: <KardexFacturacionMain kardex={kardex} />,
        }]
        : []

/** Escrituración / minuta — managed in other tabs; keep on main form save. */
const preservedKardexFields = (existing?: Kardex | null): Pick<
    CreateUpdateKardex,
    | "numescritura"
    | "fechaescritura"
    | "papelini"
    | "papelfin"
    | "folioini"
    | "foliofin"
    | "numinstrmento"
    | "txa_minuta"
    | "numminuta"
> => ({
    numescritura: existing?.numescritura ?? "",
    fechaescritura: existing?.fechaescritura ?? "",
    papelini: existing?.papelini ?? "",
    papelfin: existing?.papelfin ?? "",
    folioini: existing?.folioini ?? "",
    foliofin: existing?.foliofin ?? "",
    numinstrmento: existing?.numinstrmento ?? "",
    txa_minuta: existing?.txa_minuta ?? "",
    numminuta: existing?.numminuta ?? "",
})

const fieldInputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"

const fieldSelectClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"

interface FieldLabelProps {
    htmlFor?: string
    children: React.ReactNode
}

const FieldLabel = ({ htmlFor, children }: FieldLabelProps) => (
    <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold uppercase tracking-wide text-slate-600"
    >
        {children}
    </label>
)

interface FormFieldProps {
    label: string
    htmlFor?: string
    children: React.ReactNode
}

const FormField = ({ label, htmlFor, children }: FormFieldProps) => (
    <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
        <div className="min-h-[2.5rem]">{children}</div>
    </div>
)

interface FormSectionProps {
    title: string
    description?: string
    icon: React.ReactNode
    children: React.ReactNode
}

const FormSection = ({ title, description, icon, children }: FormSectionProps) => (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-start gap-3 border-b border-slate-100 pb-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                {icon}
            </span>
            <div>
                <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
                {description && (
                    <p className="mt-0.5 text-xs text-slate-500">{description}</p>
                )}
            </div>
        </div>
        {children}
    </section>
)

interface Props {
    setNotAllowed?: React.Dispatch<React.SetStateAction<boolean>>
    kardex?: Kardex | null
    setKardex?: React.Dispatch<React.SetStateAction<Kardex | null>>
    createKardex?: UseMutationResult<Kardex, Error, CreateKardexData>
    updateKardex?: UseMutationResult<Kardex, Error, UpdateKardexData>
}

const KardexForm = ({ 
    setNotAllowed, 
    createKardex, 
    updateKardex, 
    kardex, 
    setKardex 
}: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const user = useUserInfoStore(s => s.user)
    
    const [cannotUpdateKardex, setCannotUpdateKardex] = useState(false)
    const [cannotUpdateKardexMessage, setCannotUpdateKardexMessage] = useState('')
    const [filteredActos, setFilteredActos] = useState('')
    const [loading, setLoading] = useState(false)

    const { setMessage, setShow, setType } = useNotificationsStore()
    const bodyRender = useBodyRenderStore(s => s.bodyRender)
    const kardexTypes = useKardexTypesStore(s => s.kardexTypes)
    const [karedexReference, setKardexReference] = useState(kardex?.referencia || '') 
    const [selectedKardexType, setSelectedKardexType] = useState(kardex?.idtipkar || bodyRender) 
    const [date, setDate] = useState<Date | undefined>(() =>
        kardex?.fechaingreso
            ? parseDisplayDate(kardex.fechaingreso) ?? new Date()
            : new Date(),
    )

    // const [contrato, setContrato] = useState<{ id: string; label: string } | null>(kardex ? {id: '', label: kardex.contrato} : null);
    const [contratos, setContratos] = useState<string[]>(kardex ? getTipoActoIdArray(kardex.codactos) : [])
    const [responsible, setResponsible] = useState<{ id: string; label: string } | null>(null)
    const [recepcion, setRecepcion] = useState<string>(kardex?.recepcion || user?.idusuario.toString() || '0')

    const [selectedTemplate, setSelectedTemplate] = useState(kardex ? kardex.fktemplate : 0)
    const kardexWithSelectedTemplate = kardex ? { ...kardex, fktemplate: selectedTemplate } : null

    useEffect(() => {
        if (!kardex?.fechaingreso) return
        const parsed = parseDisplayDate(kardex.fechaingreso)
        if (parsed) setDate(parsed)
    }, [kardex?.fechaingreso])

    useEffect(() => {
        setSelectedTemplate(kardex?.fktemplate || 0)
    }, [kardex?.fktemplate])

    const [kardexId, setKardexId] = useState(kardex?.idkardex || 0)
    const [doneCreate, setDoneCreate] = useState(false);
    const updateKardexInternal = useUpdateKardex({ kardexId })
    const responsableLocked = doneCreate || Boolean(kardex?.idkardex)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (contratos.length === 0) {
            setMessage('No se ha seleccionado un contrato')
            setShow(true)
            setType('error')
            return
            
        }

        if (responsible === null) {
            setMessage('No se ha seleccionado un responsable')
            setShow(true)
            setType('error')
            return
        }

        const formattedContratoDes = contratosDes.map(des => des.trim()).join(' / ')
        
        setLoading(true)

        if (createKardex && !doneCreate) {
            createKardex.mutate({
                access,
                kardex: {
                    idtipkar: selectedKardexType,
                    fechaingreso: formatKardexFechaIngreso(date),
                    referencia: karedexReference,
                    codactos: contratos.join(''),
                    idusuario: Number(responsible.id),
                    responsable: Number(responsible.id),
                    retenido: 0,
                    desistido: 0,
                    autorizado: 0,
                    idrecogio: 0,
                    pagado: 0,
                    visita: 0,
                    idnotario: 1,
                    contrato: `${formattedContratoDes} / `, 
                    numescritura: '', 
                    fktemplate: selectedTemplate,
                    papelini: '',
                    papelfin: '',
                    folioini: '',
                    foliofin: '',
                    fechaescritura: '',
                    numinstrmento: '',
                    txa_minuta: '',
                    recepcion: recepcion,
                    estado_sisgen: 0,
                    numminuta: '',
                    nc: formattedContratoDes.includes('NO CORRE') ? '1' : '',
                    
                }
            }, {
                onSuccess: (res) => {
                    setMessage('Kardex creado exitosamente')
                    setShow(true)
                    setType('success')
                    setNotAllowed && setNotAllowed(false)
                    const newKardex = res as unknown as Kardex
                    setKardex && setKardex(newKardex)
                    setKardexId(newKardex.idkardex)
                    setDoneCreate(true)
                    // setKardex && setKardex(res.)
                }, 
                onError: (error) => {
                    setMessage(`Error al crear el kardex: ${error.message}`)
                    setShow(true)
                    setType('error')
                },
                onSettled: () => {
                    setLoading(false)
                }
            })
        }

        if (doneCreate) {
            updateKardexInternal.mutate({
                kardex: {
                    idtipkar: selectedKardexType,
                    fechaingreso: formatKardexFechaIngreso(date),
                    referencia: karedexReference,
                    codactos: contratos.join(''),
                    idusuario: Number(responsible.id),
                    responsable: Number(responsible.id),
                    retenido: 0,
                    desistido: 0,
                    autorizado: 0,
                    idrecogio: 0,
                    pagado: 0,
                    visita: 0,
                    idnotario: 1,
                    contrato: `${formattedContratoDes} / `, 
                    fktemplate: selectedTemplate,
                    recepcion: recepcion,
                    estado_sisgen: kardex?.estado_sisgen ?? 0,
                    nc: formattedContratoDes.includes('NO CORRE') ? '1' : '',
                    ...preservedKardexFields(kardex),
                },
                access
            }, {
                onSuccess: () => {
                    setMessage('Kardex actualizado exitosamente')
                    setShow(true)
                    setType('success')
                }, 
                onError: (error) => {
                    let errorMessage = ''
                    if ((error as any)?.response?.data?.error ) {
                        setCannotUpdateKardex(true)
                        setCannotUpdateKardexMessage((error as any)?.response?.data?.error)
                    } else {
                        setMessage(`Error al actualizar el kardex: ${errorMessage}`)
                        setShow(true)
                        setType('error')
                    }
                },
                onSettled: () => {
                    setLoading(false)
                }
            })
        } 

        if (kardex && updateKardex && !doneCreate) {
            updateKardex.mutate({
                kardex: {
                    // idkardex: kardex?.idkardex || 0,
                    idtipkar: selectedKardexType,
                    fechaingreso: formatKardexFechaIngreso(date) || kardex.fechaingreso,
                    referencia: karedexReference,
                    codactos: contratos.join(''),
                    idusuario: Number(responsible.id),
                    responsable: Number(responsible.id),
                    retenido: 0,
                    desistido: 0,
                    autorizado: 0,
                    idrecogio: 0,
                    pagado: 0,
                    visita: 0,
                    idnotario: 1,
                    contrato: `${formattedContratoDes} / `, 
                    fktemplate: selectedTemplate,
                    recepcion: recepcion,
                    estado_sisgen: kardex.estado_sisgen ?? 0,
                    nc: formattedContratoDes.includes('NO CORRE') ? '1' : '',
                    ...preservedKardexFields(kardex),
                },
                access
            }, {
                onSuccess: () => {
                    setMessage('Kardex actualizado exitosamente')
                    setShow(true)
                    setType('success')
                }, 
                onError: (error) => {
                    let errorMessage = ''
                    if ((error as any)?.response?.data?.error ) {
                        setCannotUpdateKardex(true)
                        setCannotUpdateKardexMessage((error as any)?.response?.data?.error)
                    } else {
                        setMessage(`Error al actualizar el kardex: ${errorMessage}`)
                        setShow(true)
                        setType('error')
                    }
                },
                onSettled: () => {
                    setLoading(false)
                }
            })
        }

    }

    const { data: tipoActos, isLoading, isError, error, isSuccess } = useGetTipoActo({ access })
    const { data: usuarios, isLoading: isLoadingUsuarios, isError: isErrorUsuarios, error: errorUsuarios, isSuccess: isSuccessUsuarios } = useGetUsuarios({ access })
    const { data: abogados, isLoading: isLoadingAbogados, isError: isErrorAbogados, error: errorAbogados, isSuccess: isSuccessAbogados } = useGetAbogados({ access })
    const { data: templates, isSuccess: isSuccessTemplates } = useGetTemplatesByActos({ access, codactos: contratos.join('') })

    const filteredTipoActos = useMemo(
        () => (tipoActos ?? []).filter((acto) => acto.idtipkar === selectedKardexType),
        [tipoActos, selectedKardexType],
    )

    const contratosDes = useMemo(
        () =>
            filteredTipoActos
                .filter((acto) => contratos.includes(acto.idtipoacto))
                .map((acto) => acto.desacto),
        [filteredTipoActos, contratos],
    )

    useEffect(() => {
        if (!isSuccessUsuarios || !usuarios?.length) return

        const responsableId = kardex?.responsable ?? kardex?.idusuario
        if (kardex && responsableId != null && responsableId > 0) {
            const saved = usuarios.find((u) => u.idusuario === responsableId)
            if (saved) {
                const next = {
                    id: String(saved.idusuario),
                    label: getTitleCase(getUsuarioDisplayName(saved)),
                }
                setResponsible((prev) =>
                    prev?.id === next.id && prev?.label === next.label ? prev : next,
                )
            }
            return
        }

        if (!kardex && user?.idusuario) {
            const current = usuarios.find((u) => u.idusuario === user.idusuario)
            const next = current
                ? {
                      id: String(current.idusuario),
                      label: getTitleCase(getUsuarioDisplayName(current)),
                  }
                : { id: String(user.idusuario), label: user.username }

            setResponsible((prev) =>
                prev?.id === next.id && prev?.label === next.label ? prev : next,
            )
        }
    }, [
        kardex?.idkardex,
        kardex?.responsable,
        kardex?.idusuario,
        usuarios,
        isSuccessUsuarios,
        user?.idusuario,
        user?.username,
    ])

    if (isLoading || isLoadingUsuarios || isLoadingAbogados) {
        return (
            <div className="flex min-h-[16rem] items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
                <p className="text-sm font-medium text-slate-500 animate-pulse">
                    Cargando formulario…
                </p>
            </div>
        )
    }
    if (isError) return <p className="text-center my-8">Error: {error.message}</p>
    if (isErrorUsuarios) return <p className="text-center my-8">Error: {errorUsuarios.message}</p>
    if (isErrorAbogados) return <p className="text-center my-8">Error: {errorAbogados.message}</p>
    if (isSuccess && isSuccessUsuarios && isSuccessAbogados )

  return (
    <>
    <form 
        onSubmit={handleSubmit}
        className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md"
    >
        <header className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-4">
            <div className="flex items-center gap-3">
                <div className="rounded-xl border border-sky-400/30 bg-sky-500/15 p-2.5">
                    <FileText className="h-5 w-5 text-sky-300" aria-hidden />
                </div>
                <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-sky-300/90">
                        {kardex ? "Instrumento protocolar" : "Registro nuevo"}
                    </p>
                    <h2 className="text-lg font-semibold tracking-tight text-white">
                        {kardex ? "Editar kardex" : "Nuevo kardex"}
                    </h2>
                </div>
            </div>
            {kardex?.kardex && (
                <span className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-1.5 font-mono text-sm font-semibold text-sky-200">
                    {kardex.kardex}
                </span>
            )}
        </header>

        <div className="space-y-4 bg-slate-50 p-4 text-slate-900 sm:p-5">
            <FormSection
                title="Datos generales"
                description="Tipo de instrumento, fecha de ingreso y referencia interna."
                icon={<CalendarDays className="h-4 w-4" aria-hidden />}
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Tipo de kardex">
                        <select
                            value={selectedKardexType}
                            onChange={(e) =>
                                setSelectedKardexType(
                                    e.target.value ? parseInt(e.target.value, 10) : 0,
                                )
                            }
                            className={fieldSelectClass}
                        >
                            <option value={0}>Tipo de kardex</option>
                            {kardexTypes.map((type) => (
                                <option key={type.idtipkar} value={type.idtipkar}>
                                    {getTitleCase(type.nomtipkar)}
                                </option>
                            ))}
                        </select>
                    </FormField>
                    <FormField label="Fecha de ingreso">
                        <Calendar
                            selectedDate={date}
                            setSelectedDate={setDate}
                            fullWidth
                        />
                    </FormField>
                    <FormField label="Referencia" htmlFor="kardex-referencia">
                        <input
                            id="kardex-referencia"
                            value={karedexReference}
                            onChange={(e) => setKardexReference(e.target.value)}
                            placeholder="Referencia del kardex"
                            className={fieldInputClass}
                        />
                    </FormField>
                    {!kardex && (
                        <div className="flex items-end sm:justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                <Sparkles className="h-4 w-4" aria-hidden />
                                {loading ? "Generando…" : "Generar kardex"}
                            </button>
                        </div>
                    )}
                </div>
            </FormSection>

            <FormSection
                title="Actos y contratos"
                description="Seleccione los actos notariales que aplican a este instrumento."
                icon={<Scale className="h-4 w-4" aria-hidden />}
            >
                <div className="mb-4 grid gap-4 sm:grid-cols-3">
                    <FormField label="Código de acto">
                        <input 
                            value={contratos.join('')}
                            onChange={() => {}}
                            disabled
                            placeholder="Código de acto"
                            className={`${fieldInputClass} bg-slate-50 text-slate-500`}
                        />
                    </FormField>
                    <FormField label="Derecho notarial">
                        <input 
                            placeholder="Derecho notarial"
                            className={fieldInputClass}
                        />
                    </FormField>
                    <FormField label="Derecho registral">
                        <input 
                            placeholder="Derecho registral"
                            className={fieldInputClass}
                        />
                    </FormField>
                </div>

                <KardexActosSelector 
                    tipoActos={filteredTipoActos}
                    contratos={contratos}
                    setSelectedIds={setContratos}
                />

                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-4 overflow-hidden"
                    >
                        <FormField label="Buscar acto" htmlFor="kardex-buscar-acto">
                            <input 
                                id="kardex-buscar-acto"
                                type="text"
                                value={filteredActos}
                                onChange={(e) => setFilteredActos(e.target.value)}
                                placeholder="Escriba para buscar un acto…"
                                className={fieldInputClass}
                            />
                        </FormField>
                        {filteredActos.length > 0 && (
                            <div className="mt-3">
                                <MultiSelect 
                                    options={filteredTipoActos
                                        .filter(acto => acto.desacto.toLowerCase().includes(filteredActos.toLowerCase()))
                                        .map(acto => ({ id: acto.idtipoacto, label: `${acto.desacto} ${acto.actosunat && `/ Sunat: ${acto.actosunat}`}  ${acto.actouif && `/ UIF: ${acto.actouif}`}` }))}
                                    placeholder="Buscar contrato..."
                                    label=""
                                    selectedIds={contratos}
                                    setSelectedIds={setContratos}
                                    resetInput={() => setFilteredActos('')}
                                />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </FormSection>

            <FormSection
                title="Equipo y configuración"
                description="Responsable del trámite, recepción y plantilla documental."
                icon={<Users className="h-4 w-4" aria-hidden />}
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Responsable">
                        {responsableLocked ? (
                            <p className={`${fieldInputClass} bg-slate-50 font-medium`}>
                                {responsible?.label || "—"}
                            </p>
                        ) : (
                            <div className="[&>div]:!my-0 [&_input]:rounded-lg [&_input]:border-slate-200 [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:shadow-sm">
                                <SearchableDropdownInput
                                    options={usuarios.map((u) => ({
                                        id: String(u.idusuario),
                                        label: getTitleCase(getUsuarioDisplayName(u)),
                                    }))}
                                    selected={responsible}
                                    setSelected={setResponsible}
                                    placeholder="Buscar responsable…"
                                />
                            </div>
                        )}
                    </FormField>
                    <FormField label="Recepción">
                        <select
                            value={recepcion}
                            onChange={(e) => setRecepcion(e.target.value)}
                            className={fieldSelectClass}
                        >
                            <option value="0">Seleccionar usuario</option>
                            {usuarios.map((u) => (
                                <option key={u.idusuario} value={String(u.idusuario)}>
                                    {getTitleCase(getUsuarioDisplayName(u))}
                                </option>
                            ))}
                        </select>
                    </FormField>
                    <FormField label="Abogado">
                        <select
                            defaultValue={0}
                            onChange={() => {}}
                            className={fieldSelectClass}
                        >
                            <option value={0}>Seleccionar abogado</option>
                            {abogados.map((abogado) => (
                                <option
                                    key={abogado.idabogado}
                                    value={Number(abogado.idabogado)}
                                >
                                    {getTitleCase(abogado.razonsocial)}
                                </option>
                            ))}
                        </select>
                    </FormField>
                    <FormField label="Funcionario">
                        <input
                            placeholder="Funcionario"
                            className={fieldInputClass}
                        />
                    </FormField>
                    <FormField label="Presentante">
                        <select
                            defaultValue={0}
                            onChange={() => {}}
                            className={fieldSelectClass}
                        >
                            <option value={0}>Seleccionar presentante</option>
                        </select>
                    </FormField>
                    <FormField label="Plantilla">
                        <select
                            value={selectedTemplate}
                            onChange={(e) =>
                                setSelectedTemplate(parseInt(e.target.value, 10) || 0)
                            }
                            className={fieldSelectClass}
                        >
                            {isSuccessTemplates && templates.length > 0 ? (
                                <>
                                    <option value={0}>Seleccione plantilla</option>
                                    {templates.map((template) => (
                                        <option
                                            key={template.pktemplate}
                                            value={template.pktemplate}
                                        >
                                            {getTitleCase(template.nametemplate)}
                                        </option>
                                    ))}
                                </>
                            ) : (
                                <option value={0}>No hay plantillas disponibles</option>
                            )}
                        </select>
                    </FormField>
                </div>
            </FormSection>

            {kardex && (
                <div className="flex justify-end rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        <Sparkles className="h-4 w-4" aria-hidden />
                        {loading ? "Guardando…" : "Grabar cambios"}
                    </button>
                </div>
            )}
        </div>
    </form>
    <TopModal 
        isOpen={cannotUpdateKardex}
        onClose={() => {
            setCannotUpdateKardex(false)
            setCannotUpdateKardexMessage('')
        }}
    >
        <ExplanationMessage 
            onClick={() => {
                setCannotUpdateKardex(false)
                setCannotUpdateKardexMessage('')
            }}
            message={cannotUpdateKardexMessage}
        />
    </TopModal>
    {kardex && 
        <>
        {kardex.idtipkar === 2 || kardex.idtipkar === 5 ? 
        <KardexFormTabs 
            tabs={[
                { id: 'details', label: 'Contratantes', content: <ContratantesMain kardex={kardex}/> },
                { id: 'notes', label: 'Digitación', content: <DigitacionMain kardex={kardexWithSelectedTemplate || kardex} /> },
                { id: 'escrituración', label: 'Escrituración', content: <EscrituracionMain kardex={kardexWithSelectedTemplate || kardex} /> },
                ...getFacturacionTab(kardex),
            ]}
        /> 
        : 
        <KardexFormTabs 
            tabs={[
                { id: 'details', label: 'Contratantes', content: <ContratantesMain kardex={kardex}/> },
                { id: 'uif', label: 'UIF/PDT Patrimonial', content: <PatrimonialMain kardex={kardex}/> },
                { id: 'notes', label: 'Digitación', content: <DigitacionMain kardex={kardexWithSelectedTemplate || kardex} /> },
                { id: 'escrituración', label: 'Escrituración', content: <EscrituracionMain kardex={kardexWithSelectedTemplate || kardex} /> },
                { id: 'uifp', label: 'UIF/PDT Participa', content: <ParticipaMain kardex={kardex}/> },
                ...getFacturacionTab(kardex),
            ]}
        />}
        </>
    }
    </>
  )
}

export default KardexForm