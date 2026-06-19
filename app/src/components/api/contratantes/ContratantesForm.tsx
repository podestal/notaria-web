import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import SimpleInput from "../../ui/SimpleInput"
import { Cliente } from "../../../services/api/cliente1Service"
import ContratantesConditionFilter from "./ContratantesConditionFilter"
import { CreateContratanteData } from "../../../hooks/api/contratantes/useCreateContratantes"
import {
    Contratante,
    CreateUpdateContratante,
    RepresentanteContratanteData,
} from "../../../services/api/contratantesService"
import { UseMutationResult } from "@tanstack/react-query"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import SingleSelect from "../../ui/SingleSelect"
import CreateRepresentante from "../representantes/CreateRepresentante"
import { UpdateContratanteData } from "../../../hooks/api/contratantes/useUpdateContratante"
import { Cliente2 } from "../../../services/api/clienteService"

interface Props {
    cliente1: Cliente | null
    cliente2: Cliente2 | null
    idtipoacto: string
    setShowContratanteForm: React.Dispatch<React.SetStateAction<boolean>>
    setShowClienteForm: React.Dispatch<React.SetStateAction<boolean>>
    setClientesCheck: React.Dispatch<React.SetStateAction<boolean>>
    setCloseUpdateContratante?: React.Dispatch<React.SetStateAction<boolean>>
    createContratante?: UseMutationResult<Contratante, Error, CreateContratanteData>
    updateContratante?: UseMutationResult<Contratante, Error, UpdateContratanteData>
    idtipkar: number
    kardex: string
    contratante?: Contratante
    selectedTipoPersona: number
    onRegisterCloseGuard?: (guard: () => boolean) => void
}

const representationOptions = [
    { value: "0", label: "Derecho propio" },
    { value: "1", label: "Representante" },
    { value: "2", label: "Por derecho propio y representante" },
]

const normalizeTiporepresentacion = (value?: string | number | null): string => {
    if (value == null || value === "") return "0"
    const parsed = parseInt(String(value).trim(), 10)
    if (parsed === 1) return "1"
    if (parsed === 2) return "2"
    if (parsed === 0) return "0"
    return "0"
}

const ContratantesForm = ({
    cliente1,
    cliente2,
    idtipoacto,
    setShowContratanteForm,
    setShowClienteForm,
    setClientesCheck,
    setCloseUpdateContratante,
    createContratante,
    updateContratante,
    idtipkar,
    kardex,
    contratante,
    selectedTipoPersona,
    onRegisterCloseGuard,
}: Props) => {
    const parseCondicion = (condicion?: string) =>
        (condicion || "")
            .split("/")
            .map((item) => item.trim())
            .filter(Boolean)

    const serializeCondicion = (actos: string[]) => {
        const normalized = actos.map((item) => item.trim()).filter(Boolean)
        if (normalized.length === 0) return ""
        return `${normalized.join("/")}/`
    }

    const notify = useNotificationsStore((s) => s.notify)
    const access = useAuthStore((s) => s.access_token) || ""
    const userEditedRepresentationRef = useRef(false)
    const pendingDiscardActionRef = useRef<(() => void) | null>(null)
    const initialSnapshotRef = useRef("")
    const snapshotBuilderRef = useRef<() => string>(() => "")
    const [baselineVersion, setBaselineVersion] = useState(0)

    const [razonSocial, setRazonSocial] = useState(cliente1 ? cliente1.razonsocial : "")
    const [domFiscal, setDomFiscal] = useState(cliente1 ? cliente1.domfiscal : "")
    const [apePaterno, setApePaterno] = useState(cliente1 ? cliente1.apepat : "")
    const [apeMaterno, setApeMaterno] = useState(cliente1 ? cliente1.apemat : "")
    const [prinom, setPrinom] = useState(cliente1 ? cliente1.prinom : "")
    const [segnom, setSegnom] = useState(cliente1 ? cliente1.segnom : "")
    const [address, setAddress] = useState(cliente1 ? cliente1.direccion : "")
    const [representanteCreated, setRepresentanteCreated] = useState(
        Boolean(contratante?.idcontratanterp)
    )
    const [selectedRepresentation, setSelectedRepresentation] = useState(() =>
        normalizeTiporepresentacion(contratante?.tiporepresentacion)
    )
    const [selectedActos, setSelectedActos] = useState<string[]>(
        contratante ? parseCondicion(contratante.condicion) : []
    )
    const [firma, setFirma] = useState(() => {
        if (selectedTipoPersona === 2) return false
        return contratante ? contratante.firma === "1" : true
    })
    const [incluirIndic, setIncluirIndic] = useState(contratante ? contratante.indice === "1" : true)
    const [isLoading, setIsLoading] = useState(false)
    const [condicionesExpanded, setCondicionesExpanded] = useState(
        () => (contratante ? parseCondicion(contratante.condicion).length === 0 : true)
    )
    const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)
    const [contratanteRepresented, setContratanteRepresented] = useState(
        contratante ? contratante.idcontratanterp : ""
    )
    const [representanteData, setRepresentanteData] = useState<RepresentanteContratanteData>(() => ({
        idsedereg: contratante?.idsedereg ?? "",
        numpartida: contratante?.numpartida ?? "",
        facultades: contratante?.facultades ?? "",
        inscrito: contratante?.inscrito ?? "1",
    }))

    const buildComparableSnapshot = useCallback(() => {
        const base = {
            selectedActos: [...selectedActos].map((item) => item.trim()).filter(Boolean).sort(),
            firma,
            incluirIndic,
            selectedRepresentation,
        }

        if (selectedRepresentation === "0") {
            return JSON.stringify(base)
        }

        return JSON.stringify({
            ...base,
            contratanteRepresented: contratanteRepresented.trim(),
            representanteData: {
                idsedereg: representanteData.idsedereg ?? "",
                numpartida: representanteData.numpartida ?? "",
                facultades: representanteData.facultades ?? "",
                inscrito: representanteData.inscrito ?? "1",
            },
        })
    }, [
        selectedActos,
        firma,
        incluirIndic,
        selectedRepresentation,
        contratanteRepresented,
        representanteData,
    ])

    snapshotBuilderRef.current = buildComparableSnapshot

    const isDirty = useMemo(() => {
        if (!initialSnapshotRef.current) return false
        return buildComparableSnapshot() !== initialSnapshotRef.current
    }, [buildComparableSnapshot, baselineVersion])

    const captureBaseline = useCallback(() => {
        initialSnapshotRef.current = snapshotBuilderRef.current()
        setBaselineVersion((version) => version + 1)
    }, [])

    const markSaved = useCallback(() => {
        captureBaseline()
    }, [captureBaseline])

    const requestDiscard = useCallback(
        (action: () => void) => {
            if (!isDirty) {
                action()
                return
            }
            pendingDiscardActionRef.current = action
            setShowDiscardConfirm(true)
        },
        [isDirty]
    )

    const handleRepresentationSelect = (value: string) => {
        userEditedRepresentationRef.current = true
        setSelectedRepresentation(value)
        if (value === "0") {
            setContratanteRepresented("")
            setRepresentanteCreated(false)
            setRepresentanteData({
                idsedereg: "",
                numpartida: "",
                facultades: "",
                inscrito: "1",
            })
        }
    }

    const buildContratantePayload = (idcontratanterpOverride?: string): CreateUpdateContratante => {
        const idcontratanterp =
            selectedRepresentation === "0"
                ? ""
                : (idcontratanterpOverride ?? contratanteRepresented)

        const usesRepresentacion = selectedRepresentation !== "0"

        return {
            idtipkar,
            kardex,
            condicion: serializeCondicion(selectedActos),
            firma: selectedTipoPersona === 2 ? "0" : firma ? "1" : "0",
            fechafirma: selectedTipoPersona === 2 ? "" : (contratante?.fechafirma ?? ""),
            resfirma: contratante?.resfirma ?? 0,
            tiporepresentacion: selectedRepresentation,
            indice: incluirIndic ? "1" : "0",
            visita: contratante?.visita ?? "0",
            inscrito: usesRepresentacion ? representanteData.inscrito : (contratante?.inscrito ?? "1"),
            idcontratanterp: idcontratanterp,
            idsedereg: usesRepresentacion ? representanteData.idsedereg : "",
            numpartida: usesRepresentacion ? representanteData.numpartida : "",
            facultades: usesRepresentacion ? representanteData.facultades : "",
        }
    }

    const handleRepresentanteLinked = (
        idcontratanterp: string,
        data: RepresentanteContratanteData
    ) => {
        userEditedRepresentationRef.current = true
        setContratanteRepresented(idcontratanterp)
        setRepresentanteCreated(true)
        setRepresentanteData(data)
        notify("success", "Representante vinculado. Recuerde pulsar «Actualizar contratante» para guardar.")
    }

    useEffect(() => {
        if (!contratante?.idcontratante || userEditedRepresentationRef.current) return
        setSelectedRepresentation(normalizeTiporepresentacion(contratante.tiporepresentacion))
        setRepresentanteCreated(Boolean(contratante.idcontratanterp))
        setContratanteRepresented(contratante.idcontratanterp || "")
        setRepresentanteData({
            idsedereg: contratante.idsedereg ?? "",
            numpartida: contratante.numpartida ?? "",
            facultades: contratante.facultades ?? "",
            inscrito: contratante.inscrito ?? "1",
        })
    }, [
        contratante?.idcontratante,
        contratante?.tiporepresentacion,
        contratante?.idcontratanterp,
        contratante?.idsedereg,
        contratante?.numpartida,
        contratante?.facultades,
        contratante?.inscrito,
    ])

    useEffect(() => {
        userEditedRepresentationRef.current = false
    }, [contratante?.idcontratante])

    useEffect(() => {
        if (selectedTipoPersona === 2) {
            setFirma(false)
        }
    }, [selectedTipoPersona])

    useEffect(() => {
        if (cliente1) {
            setApePaterno(cliente1.apepat)
            setApeMaterno(cliente1.apemat)
            setPrinom(cliente1.prinom)
            setSegnom(cliente1.segnom)
            setAddress(cliente1.direccion)
            setRazonSocial(cliente1.razonsocial)
            setDomFiscal(cliente1.domfiscal)
        } else if (cliente2) {
            setApePaterno(cliente2.apepat)
            setApeMaterno(cliente2.apemat)
            setPrinom(cliente2.prinom)
            setSegnom(cliente2.segnom)
            setAddress(cliente2.direccion)
            setRazonSocial(cliente2.razonsocial)
            setDomFiscal(cliente2.domfiscal)
        } else {
            setApePaterno("")
            setApeMaterno("")
            setPrinom("")
            setSegnom("")
            setAddress("")
            setRazonSocial("")
            setDomFiscal("")
        }
    }, [cliente1, cliente2])

    useEffect(() => {
        const timer = window.setTimeout(() => {
            captureBaseline()
        }, 0)
        return () => window.clearTimeout(timer)
    }, [contratante?.idcontratante, captureBaseline])

    useEffect(() => {
        onRegisterCloseGuard?.(() => {
            if (!isDirty) return true
            pendingDiscardActionRef.current = () => {
                setCloseUpdateContratante?.(false)
            }
            setShowDiscardConfirm(true)
            return false
        })
    }, [isDirty, onRegisterCloseGuard, setCloseUpdateContratante])

    const handleCreateContratante = (e: React.FormEvent) => {
        e.preventDefault()

        if (selectedTipoPersona === 1) {
            if (selectedRepresentation !== "0" && !contratanteRepresented.trim()) {
                notify("error", "Debe vincular un representante.")
                return
            }

            if (selectedActos.length === 0) {
                notify("error", "Debe seleccionar al menos una condición para el contratante.")
                return
            }

            if (!apePaterno) {
                notify("error", "El apellido paterno es obligatorio.")
                return
            }

            if (!prinom) {
                notify("error", "El primer nombre es obligatorio.")
                return
            }

            if (!apeMaterno) {
                notify("error", "El apellido materno es obligatorio.")
                return
            }

            if (!address) {
                notify("error", "La dirección es obligatoria.")
                return
            }
        } else if (selectedTipoPersona === 2) {
            if (selectedActos.length === 0) {
                notify("error", "Debe seleccionar al menos una condición para el contratante.")
                return
            }

            if (!razonSocial) {
                notify("error", "La razón social es obligatoria.")
                return
            }

            if (!domFiscal) {
                notify("error", "La dirección fiscal es obligatoria.")
                return
            }
        }

        setIsLoading(true)
        const contratantePayload = buildContratantePayload()

        const mutationCallbacks = {
            onSettled: () => setIsLoading(false),
        }

        if (updateContratante) {
            updateContratante.mutate(
                { access, contratante: contratantePayload },
                {
                    ...mutationCallbacks,
                    onSuccess: () => {
                        markSaved()
                        notify("success", "Contratante actualizado correctamente.")
                        setShowContratanteForm(false)
                        setShowClienteForm(false)
                        setClientesCheck(false)
                        setCloseUpdateContratante?.(false)
                    },
                    onError: () => {
                        notify("error", "Error al actualizar el contratante. Por favor, inténtelo de nuevo.")
                    },
                }
            )
            return
        }

        if (createContratante) {
            createContratante.mutate(
                { access, contratante: contratantePayload },
                {
                    ...mutationCallbacks,
                    onSuccess: () => {
                        markSaved()
                        notify("success", "Contratante creado correctamente.")
                        setShowContratanteForm(false)
                        setShowClienteForm(false)
                        setClientesCheck(false)
                    },
                    onError: () => {
                        notify("error", "Error al crear el contratante. Por favor, inténtelo de nuevo.")
                    },
                }
            )
            return
        }

        setIsLoading(false)
    }

    const showRepresentanteSection =
        selectedRepresentation === "1" || selectedRepresentation === "2"

    const numdoc = cliente1?.numdoc ?? cliente2?.numdoc ?? ""

    return (
        <>
            <form onSubmit={handleCreateContratante} className="text-black">
                <h2 className="mb-6 text-center text-xl font-bold">
                    {contratante ? "Editar contratante" : "Nuevo contratante"}
                </h2>

                <div className="space-y-4">
                    {selectedTipoPersona === 1 && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <SimpleInput
                                label="Apellido Paterno"
                                value={apePaterno}
                                setValue={setApePaterno}
                                horizontal
                                required
                                disabled
                            />
                            <SimpleInput
                                label="Apellido Materno"
                                value={apeMaterno}
                                setValue={setApeMaterno}
                                horizontal
                                required
                                disabled
                            />
                            <SimpleInput
                                label="Primer Nombre"
                                value={prinom}
                                setValue={setPrinom}
                                horizontal
                                required
                                disabled
                            />
                            <SimpleInput
                                label="Segundo Nombre"
                                value={segnom}
                                setValue={setSegnom}
                                horizontal
                                disabled
                            />
                            <div className="sm:col-span-2">
                                <SimpleInput
                                    label="Dirección"
                                    value={address}
                                    setValue={setAddress}
                                    horizontal
                                    fullWidth
                                    required
                                    disabled
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <SimpleInput
                                    label="Número de documento"
                                    value={numdoc}
                                    setValue={() => {}}
                                    horizontal
                                    disabled
                                    fullWidth
                                />
                            </div>
                        </div>
                    )}

                    {selectedTipoPersona === 2 && (
                        <div className="grid grid-cols-1 gap-4">
                            <SimpleInput
                                label="Razón Social"
                                value={razonSocial}
                                setValue={setRazonSocial}
                                horizontal
                                required
                                disabled
                                fullWidth
                            />
                            <SimpleInput
                                label="Dirección Fiscal"
                                value={domFiscal}
                                setValue={setDomFiscal}
                                horizontal
                                required
                                disabled
                                fullWidth
                            />
                            <SimpleInput
                                label="Número de documento"
                                value={numdoc}
                                setValue={() => {}}
                                horizontal
                                disabled
                                fullWidth
                            />
                        </div>
                    )}

                    <ContratantesConditionFilter
                        idtipoacto={idtipoacto}
                        kardex={kardex}
                        selectedActos={selectedActos}
                        setSelectedActos={setSelectedActos}
                        expanded={condicionesExpanded}
                        onToggle={() => setCondicionesExpanded((prev) => !prev)}
                    />

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="mb-3 text-xs font-semibold text-slate-700">Opciones del contratante</p>
                        <div className="flex flex-wrap items-center gap-8">
                            {selectedTipoPersona === 1 ? (
                                <>
                                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={firma}
                                            onChange={(e) => setFirma(e.target.checked)}
                                        />
                                        Firma
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={incluirIndic}
                                            onChange={(e) => setIncluirIndic(e.target.checked)}
                                        />
                                        Incluir en el índice
                                    </label>
                                </>
                            ) : (
                                <label className="flex items-center gap-2 text-sm text-slate-500">
                                    <input
                                        type="checkbox"
                                        checked={false}
                                        disabled
                                        aria-label="Firma no aplica para persona jurídica"
                                    />
                                    Firma (no aplica para persona jurídica)
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="mb-3 text-xs font-semibold text-slate-700">Tipo de representación</p>
                        <SingleSelect
                            options={representationOptions}
                            selected={selectedRepresentation}
                            onChange={handleRepresentationSelect}
                            onSelect={handleRepresentationSelect}
                        />
                    </div>

                    <AnimatePresence initial={false}>
                        {showRepresentanteSection && (
                            <motion.div
                                key="representante-section"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                            >
                                <CreateRepresentante
                                    kardex={kardex}
                                    setRepresentanteCreated={setRepresentanteCreated}
                                    setContratanteRepresented={setContratanteRepresented}
                                    setOpenRepForm={() => {}}
                                    onRepresentanteLinked={handleRepresentanteLinked}
                                    editingContratanteId={contratante?.idcontratante}
                                    linkedRepresentanteContratanteId={contratanteRepresented}
                                    initialRepresentanteData={representanteData}
                                    embedded
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {isDirty && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                        >
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                            <p>
                                Tiene cambios sin guardar. Pulse{" "}
                                <strong>«{contratante ? "Actualizar" : "Crear"} contratante»</strong> para
                                conservarlos; de lo contrario se perderán al cerrar.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4">
                    <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-xs transition duration-300 hover:bg-gray-300"
                        onClick={() =>
                            requestDiscard(() => {
                                setShowContratanteForm(false)
                                setShowClienteForm(true)
                            })
                        }
                    >
                        Editar cliente
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-md bg-blue-600 text-white px-4 py-2 text-xs transition duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading
                            ? "Guardando..."
                            : contratante
                              ? "Actualizar contratante"
                              : "Crear contratante"}
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {showDiscardConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                        >
                            <h3 className="text-lg font-semibold text-slate-900">Cambios sin guardar</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Los cambios no se guardarán si continúa. ¿Desea salir sin actualizar el
                                contratante?
                            </p>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    onClick={() => {
                                        setShowDiscardConfirm(false)
                                        pendingDiscardActionRef.current = null
                                    }}
                                >
                                    Seguir editando
                                </button>
                                <button
                                    type="button"
                                    className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                                    onClick={() => {
                                        const action = pendingDiscardActionRef.current
                                        setShowDiscardConfirm(false)
                                        pendingDiscardActionRef.current = null
                                        action?.()
                                    }}
                                >
                                    Salir sin guardar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default ContratantesForm
