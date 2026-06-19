import { useEffect, useMemo, useState, type ReactNode } from "react"
import { CheckCircle2, UserRound } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { SedeRegistral } from "../../../services/api/sedesRegistralesService"
import { Contratante, RepresentanteContratanteData } from "../../../services/api/contratantesService"
import getTitleCase from "../../../utils/getTitleCase"
import { CreateRepresentanteData } from "../../../hooks/api/representante/useCreateRepresentante"
import { UpdateRepresentanteData } from "../../../hooks/api/representante/useUpdateRepresentante"
import { Representante } from "../../../services/api/representantesService"
import { UseMutationResult } from "@tanstack/react-query"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useAuthStore from "../../../store/useAuthStore"
import {
    parseInscritoValue,
    parseSedeRegistralValue,
    resolveLinkedRepresentanteContratanteId,
} from "../../../utils/representanteFormUtils"

interface Props {
    sedesRegistrales: SedeRegistral[]
    contratantes: Contratante[]
    kardex: string
    createRepresentante: UseMutationResult<Representante, Error, CreateRepresentanteData>
    updateRepresentante: UseMutationResult<Representante, Error, UpdateRepresentanteData>
    setRepresentanteCreated: React.Dispatch<React.SetStateAction<boolean>>
    setContratanteRepresented: React.Dispatch<React.SetStateAction<string>>
    setOpenRepForm: React.Dispatch<React.SetStateAction<boolean>>
    onRepresentanteLinked?: (
        idcontratanterp: string,
        representanteData: RepresentanteContratanteData
    ) => void
    editingContratanteId?: string
    existingRepresentante?: Representante | null
    linkedRepresentanteContratanteId?: string
    initialRepresentanteData?: RepresentanteContratanteData
    embedded?: boolean
}

const fieldControlClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"

interface RegistralFieldProps {
    label: string
    htmlFor: string
    error?: string
    children: ReactNode
}

const RegistralField = ({ label, htmlFor, error, children }: RegistralFieldProps) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor={htmlFor} className="text-xs font-semibold text-slate-700">
            {label}
        </label>
        {children}
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
)

const RepresentantesForm = ({
    sedesRegistrales,
    contratantes,
    kardex,
    createRepresentante,
    updateRepresentante,
    setRepresentanteCreated,
    setContratanteRepresented,
    setOpenRepForm,
    onRepresentanteLinked,
    editingContratanteId,
    existingRepresentante,
    linkedRepresentanteContratanteId,
    initialRepresentanteData,
    embedded = false,
}: Props) => {
    const queryClient = useQueryClient()
    const { setMessage, setShow, setType } = useNotificationsStore()
    const access = useAuthStore((s) => s.access_token) || ""

    const [representanteRecordId, setRepresentanteRecordId] = useState<number | null>(null)
    const [facultades, setFacultades] = useState("")
    const [subscribed, setSubscribed] = useState(1)
    const [sedeRegistral, setSedeRegistral] = useState(0)
    const [nPartida, setNPartida] = useState("")

    const [facultadesError, setFacultadesError] = useState("")
    const [sedeRegistralError, setSedeRegistralError] = useState("")
    const [nPartidaError, setNPartidaError] = useState("")

    const resolvedLinkedId = useMemo(
        () =>
            resolveLinkedRepresentanteContratanteId(
                linkedRepresentanteContratanteId,
                existingRepresentante,
                contratantes
            ),
        [linkedRepresentanteContratanteId, existingRepresentante, contratantes]
    )

    const availableContratantes = useMemo(
        () => contratantes.filter((contratante) => contratante.idcontratante !== editingContratanteId),
        [contratantes, editingContratanteId]
    )

    useEffect(() => {
        if (existingRepresentante?.id) {
            setRepresentanteRecordId(existingRepresentante.id)
            setFacultades(existingRepresentante.facultades ?? "")
            setSubscribed(parseInscritoValue(existingRepresentante.inscrito))
            setSedeRegistral(parseSedeRegistralValue(existingRepresentante.sede_registral))
            setNPartida(existingRepresentante.partida ?? "")
            return
        }

        setRepresentanteRecordId(null)
        if (!initialRepresentanteData) return

        setFacultades(initialRepresentanteData.facultades ?? "")
        setSubscribed(parseInscritoValue(initialRepresentanteData.inscrito))
        setSedeRegistral(parseSedeRegistralValue(initialRepresentanteData.idsedereg))
        setNPartida(initialRepresentanteData.numpartida ?? "")
    }, [existingRepresentante, initialRepresentanteData])

    const isInscrito = subscribed === 1

    const handleSubscribedChange = (value: number) => {
        setSubscribed(value)
        if (value === 0) {
            setSedeRegistral(0)
            setNPartida("")
            setSedeRegistralError("")
            setNPartidaError("")
        }
    }

    const validateRepresentanteFields = (): boolean => {
        setFacultadesError("")
        setSedeRegistralError("")
        setNPartidaError("")
        return true
    }

    const finishSuccess = (
        contratante: Contratante,
        representanteData: RepresentanteContratanteData,
        isUpdate: boolean
    ) => {
        setType("success")
        setMessage(
            isUpdate ? "Representante actualizado correctamente" : "Representante creado correctamente"
        )
        setShow(true)
        if (!embedded) {
            setOpenRepForm(false)
        }

        if (editingContratanteId) {
            queryClient.invalidateQueries({
                queryKey: ["representante", "by_contratante", editingContratanteId],
            })
        }

        if (onRepresentanteLinked) {
            onRepresentanteLinked(contratante.idcontratante, representanteData)
        } else {
            setRepresentanteCreated(true)
            setContratanteRepresented(contratante.idcontratante)
        }
    }

    const handleSubmit = (contratante: Contratante) => {
        if (!validateRepresentanteFields()) {
            return
        }

        const sedeValue = isInscrito ? sedeRegistral.toString() : ""
        const partidaValue = isInscrito ? nPartida : ""

        const representanteData: RepresentanteContratanteData = {
            facultades,
            inscrito: subscribed.toString(),
            idsedereg: sedeValue,
            numpartida: partidaValue,
        }

        const payload = {
            facultades,
            inscrito: representanteData.inscrito,
            sede_registral: sedeValue,
            partida: partidaValue,
            idtipoacto: null,
            kardex,
            idcontratante: editingContratanteId ?? contratante.idcontratante,
            idcontratante_r: contratante.cliente_id,
            id_ro_repre: null,
            odb: null,
            ido: null,
        }

        const onError = (error: Error) => {
            setType("error")
            setMessage(`Error al guardar el representante: ${error.message}`)
            setShow(true)
        }

        if (representanteRecordId) {
            updateRepresentante.mutate(
                {
                    access,
                    representanteId: representanteRecordId,
                    representante: payload,
                },
                {
                    onSuccess: () => finishSuccess(contratante, representanteData, true),
                    onError,
                }
            )
            return
        }

        createRepresentante.mutate(
            { access, representante: payload },
            {
                onSuccess: (saved) => {
                    if (saved?.id) setRepresentanteRecordId(saved.id)
                    finishSuccess(contratante, representanteData, false)
                },
                onError,
            }
        )
    }

    const isSaving = createRepresentante.isPending || updateRepresentante.isPending

    return (
        <div
            className={
                embedded
                    ? "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                    : "flex flex-col gap-4 p-4"
            }
        >
            <div className={embedded ? "border-b border-slate-100 bg-slate-50/80 px-4 py-3" : ""}>
                <h2
                    className={`font-semibold text-slate-800 ${embedded ? "text-sm" : "mb-2 text-center text-2xl"}`}
                >
                    Datos del representante
                </h2>
                {embedded && (
                    <p className="mt-0.5 text-xs text-slate-500">
                        Complete los datos registrales y elija quién representará al contratante.
                    </p>
                )}
            </div>

            <div className={embedded ? "space-y-5 p-4" : "flex flex-col gap-4"}>
                <section className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Información registral
                    </p>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <RegistralField label="Facultades" htmlFor="rep-facultades" error={facultadesError}>
                            <input
                                id="rep-facultades"
                                type="text"
                                value={facultades}
                                onChange={(e) => {
                                    setFacultadesError("")
                                    setFacultades(e.target.value)
                                }}
                                placeholder="Facultades"
                                className={fieldControlClass}
                            />
                        </RegistralField>
                        {isInscrito && (
                            <RegistralField
                                label="Número de Partida"
                                htmlFor="rep-partida"
                                error={nPartidaError}
                            >
                                <input
                                    id="rep-partida"
                                    type="text"
                                    value={nPartida}
                                    onChange={(e) => {
                                        setNPartidaError("")
                                        setNPartida(e.target.value)
                                    }}
                                    placeholder="Número de Partida"
                                    className={fieldControlClass}
                                />
                            </RegistralField>
                        )}
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <RegistralField label="Inscrito" htmlFor="rep-inscrito">
                            <select
                                id="rep-inscrito"
                                value={subscribed}
                                onChange={(e) => handleSubscribedChange(parseInt(e.target.value, 10))}
                                className={fieldControlClass}
                            >
                                <option value={1}>Sí</option>
                                <option value={0}>No</option>
                            </select>
                        </RegistralField>
                        {isInscrito && (
                            <RegistralField
                                label="Sede Registral"
                                htmlFor="rep-sede"
                                error={sedeRegistralError}
                            >
                                <select
                                    id="rep-sede"
                                    value={sedeRegistral}
                                    onChange={(e) => {
                                        setSedeRegistralError("")
                                        setSedeRegistral(parseInt(e.target.value, 10))
                                    }}
                                    className={fieldControlClass}
                                >
                                    <option value={0}>Seleccione sede registral</option>
                                    {sedesRegistrales.map((sede) => (
                                        <option key={sede.idsedereg} value={parseInt(sede.idsedereg, 10)}>
                                            {sede.dessede}
                                        </option>
                                    ))}
                                </select>
                            </RegistralField>
                        )}
                    </div>
                </section>

                <section>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Elegir persona representante
                    </p>
                    <div className="flex flex-col gap-2">
                        {availableContratantes.length === 0 && (
                            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
                                No hay otras personas registradas como contratantes en este kardex.
                            </p>
                        )}
                        {availableContratantes.map((contratante) => {
                            const isLinked = contratante.idcontratante === resolvedLinkedId

                            return (
                                <div
                                    key={contratante.idcontratante}
                                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                                        isLinked
                                            ? "border-emerald-300 bg-emerald-50/70 ring-1 ring-emerald-100"
                                            : "border-slate-200 bg-white hover:bg-slate-50"
                                    }`}
                                >
                                    <span
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                            isLinked
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        {isLinked ? (
                                            <CheckCircle2 className="h-4 w-4" aria-hidden />
                                        ) : (
                                            <UserRound className="h-4 w-4" aria-hidden />
                                        )}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-slate-800">
                                            {getTitleCase(contratante.cliente)}
                                        </p>
                                        {isLinked && (
                                            <p className="text-xs text-emerald-700">Seleccionado como representante</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleSubmit(contratante)}
                                        type="button"
                                        disabled={isSaving}
                                        className="shrink-0 rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs transition duration-300 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSaving
                                            ? "Guardando..."
                                            : isLinked && representanteRecordId
                                              ? "Actualizar"
                                              : isLinked
                                                ? "Confirmar"
                                                : "Seleccionar"}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default RepresentantesForm
