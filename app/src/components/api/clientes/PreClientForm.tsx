import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, Search, UserRoundSearch } from "lucide-react"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import axios from "axios"
import { Cliente } from "../../../services/api/cliente1Service"
import CreateCliente from "./CreateCliente"
import UpdateCliente from "./UpdateCliente"
import CreateContratante from "../contratantes/CreateContratante"
import ContratanteClienteFormTransition from "../contratantes/ContratanteClienteFormTransition"
import { documentoJuridicaOptions, documentNaturalOptions } from "../../../data/clienteData"
import useAuthStore from "../../../store/useAuthStore"
import ClienteLookByName from "./byName/ClienteLookByName"

interface Props {
    idtipoacto: string
    idtipkar: number
    kardex: string
    setClientesCheck: React.Dispatch<React.SetStateAction<boolean>>
}

const PERSONA_OPTIONS = [
    { value: 1, label: "Persona Natural", hint: "DNI y documentos personales" },
    { value: 2, label: "Persona Jurídica", hint: "RUC de empresa u organización" },
] as const

const DOCUMENT_SHORT_LABEL: Record<number, string> = {
    1: "DNI",
    2: "Carné extranjería",
    3: "FF.AA.",
    4: "PNP",
    5: "Pasaporte",
    6: "Cédula ciudadanía",
    7: "Cédula diplomática",
    8: "RUC",
    9: "Otro",
    10: "Sin documento",
    11: "Partida nacimiento",
}

const fieldClass =
    "w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"

const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500"

const PreClientForm = ({ idtipoacto, idtipkar, kardex, setClientesCheck }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""

    const { setType, setMessage, setShow } = useNotificationsStore()
    const [selectedTipoPersona, setSelectedTipoPersona] = useState(0)
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState(0)
    const [document, setDocument] = useState("")
    const [showContratanteForm, setShowContratanteForm] = useState(false)
    const [showClienteForm, setShowClienteForm] = useState(false)
    const [cliente1, setCliente1] = useState<Cliente | null>(null)
    const [loading, setLoading] = useState(false)

    const documentOptions = (
        selectedTipoPersona === 1
            ? documentNaturalOptions
            : selectedTipoPersona === 2
              ? documentoJuridicaOptions
              : []
    ).filter((option) => option.value > 0)

    const selectedDocumentLabel =
        DOCUMENT_SHORT_LABEL[selectedTipoDocumento] ||
        documentOptions.find((option) => option.value === selectedTipoDocumento)?.label ||
        "Documento"

    const handleTipoDocumentoChange = (value: number) => {
        setSelectedTipoDocumento(value)
        setDocument("")
        if (value !== 10) {
            setShowClienteForm(false)
            setShowContratanteForm(false)
            setCliente1(null)
        }
    }

    const showDocumentNumber =
        selectedTipoPersona === 1
            ? selectedTipoDocumento > 0
            : selectedTipoPersona === 2
              ? selectedTipoDocumento === 8
              : false

    const canSearchByDocument =
        selectedTipoPersona === 1
            ? selectedTipoDocumento > 0 && document.length > 0 && !loading
            : selectedTipoPersona === 2
              ? selectedTipoDocumento === 8 && document.length === 11 && !loading
              : false

    useEffect(() => {
        setSelectedTipoDocumento(0)
        setDocument("")
    }, [selectedTipoPersona])

    const handleTipoPersonaChange = (value: number) => {
        setSelectedTipoPersona(value)
        setCliente1(null)
        setShowClienteForm(false)
        setShowContratanteForm(false)
    }

    useEffect(() => {
        if (selectedTipoDocumento === 10) {
            setDocument("")
            setShowClienteForm(true)
            setShowContratanteForm(false)
            setCliente1(null)
        }
    }, [selectedTipoPersona, selectedTipoDocumento])

    const handleLookup = (e: React.FormEvent) => {
        e.preventDefault()

        if (selectedTipoPersona === 0) {
            setType("error")
            setMessage("Debe seleccionar un tipo de persona y proporcionar un documento válido.")
            setShow(true)
            return
        }

        if (selectedTipoPersona === 1 && document.length !== 8) {
            setType("error")
            setMessage("El DNI debe tener 8 dígitos.")
            setShow(true)
            return
        }

        if (selectedTipoPersona === 2 && selectedTipoDocumento === 8 && document.length !== 11) {
            setType("error")
            setMessage("El RUC debe tener 11 dígitos.")
            setShow(true)
            return
        }

        if (selectedTipoDocumento === 10) {
            return
        }

        if (selectedTipoDocumento === 0 || selectedTipoDocumento === null) {
            setType("error")
            setMessage("Debe seleccionar un tipo de documento.")
            setShow(true)
            return
        }

        if (document.length === 0) {
            setType("error")
            setMessage("Debe proporcionar un número de documento.")
            setShow(true)
            return
        }
        setLoading(true)

        if (selectedTipoPersona === 1) {
            axios
                .get(`${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${document}`, {
                    headers: {
                        Authorization: `JWT ${access}`,
                    },
                })
                .then((response) => {
                    if (response.data.idcliente) {
                        setCliente1(response.data)
                        setShowContratanteForm(true)
                        setShowClienteForm(false)
                    } else {
                        setCliente1(null)
                        setShowContratanteForm(false)
                        setShowClienteForm(true)
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
                .finally(() => {
                    setLoading(false)
                })
        }

        if (selectedTipoPersona === 2) {
            axios
                .get(`${import.meta.env.VITE_API_URL}cliente/by_ruc/?ruc=${document}`, {
                    headers: {
                        Authorization: `JWT ${access}`,
                    },
                })
                .then((response) => {
                    if (response.data.idcliente) {
                        setCliente1(response.data)
                        setShowContratanteForm(true)
                        setShowClienteForm(false)
                    } else {
                        setCliente1(null)
                        setShowContratanteForm(false)
                        setShowClienteForm(true)
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <>
            <div className="mx-auto w-full max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80"
                >
                    <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                                <UserRoundSearch className="h-5 w-5" aria-hidden />
                            </span>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Buscar Cliente</h2>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Elija el tipo de persona y busque por documento, o por nombre / razón social.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleLookup} className="space-y-5 px-5 py-5 sm:px-6">
                        <div>
                            <p className={labelClass}>Tipo de persona</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {PERSONA_OPTIONS.map((option) => {
                                    const active = selectedTipoPersona === option.value
                                    return (
                                        <motion.button
                                            key={option.value}
                                            type="button"
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleTipoPersonaChange(option.value)}
                                            className={`relative cursor-pointer overflow-hidden rounded-xl border px-4 py-3 text-left transition ${
                                                active
                                                    ? "border-sky-300 bg-sky-50 shadow-sm"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                        >
                                            {active && (
                                                <motion.span
                                                    layoutId="persona-active"
                                                    className="absolute inset-0 rounded-xl bg-sky-50"
                                                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                                />
                                            )}
                                            <span className="relative z-10 block text-sm font-semibold text-slate-900">
                                                {option.label}
                                            </span>
                                            <span className="relative z-10 mt-0.5 block text-xs text-slate-500">
                                                {option.hint}
                                            </span>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </div>

                        <AnimatePresence mode="wait" initial={false}>
                            {selectedTipoPersona > 0 && (
                                <motion.div
                                    key={`docs-${selectedTipoPersona}`}
                                    initial={{ opacity: 0, y: 12, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                    exit={{ opacity: 0, y: -8, height: 0 }}
                                    transition={{ duration: 0.28, ease: "easeOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-4">
                                        <motion.div
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.04, duration: 0.24 }}
                                        >
                                            <p className={labelClass}>Tipo de documento</p>
                                            <div className="flex flex-wrap gap-2">
                                                {documentOptions.map((option, index) => {
                                                    const active = selectedTipoDocumento === option.value
                                                    return (
                                                        <motion.button
                                                            key={option.value}
                                                            type="button"
                                                            initial={{ opacity: 0, y: 6 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.03 * index, duration: 0.2 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            onClick={() => handleTipoDocumentoChange(option.value)}
                                                            title={option.label}
                                                            className={`cursor-pointer rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                                                                active
                                                                    ? "border-sky-400 bg-sky-600 text-white shadow-sm"
                                                                    : "border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
                                                            }`}
                                                        >
                                                            {DOCUMENT_SHORT_LABEL[option.value] || option.label}
                                                        </motion.button>
                                                    )
                                                })}
                                            </div>
                                        </motion.div>

                                        <AnimatePresence mode="wait" initial={false}>
                                            {showDocumentNumber && (
                                                <motion.div
                                                    key={`doc-number-${selectedTipoDocumento}`}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    transition={{ duration: 0.22 }}
                                                    className="flex flex-col gap-2 sm:flex-row sm:items-end"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <label className={labelClass} htmlFor="preclient-num-doc">
                                                            Número de documento
                                                        </label>
                                                        <input
                                                            id="preclient-num-doc"
                                                            type="text"
                                                            value={document}
                                                            onChange={(e) => setDocument(e.target.value)}
                                                            placeholder={
                                                                selectedTipoPersona === 2
                                                                    ? "Ingrese el RUC"
                                                                    : selectedDocumentLabel
                                                            }
                                                            className={fieldClass}
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                    <motion.button
                                                        type="submit"
                                                        disabled={!canSearchByDocument}
                                                        whileHover={canSearchByDocument ? { y: -1 } : undefined}
                                                        whileTap={canSearchByDocument ? { scale: 0.98 } : undefined}
                                                        className="inline-flex h-[42px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {loading ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                                                        ) : (
                                                            <Search className="h-4 w-4" aria-hidden />
                                                        )}
                                                        {loading ? "Buscando" : "Buscar"}
                                                    </motion.button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {selectedTipoPersona === 2 && selectedTipoDocumento === 10 && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-3 text-xs text-slate-500"
                                        >
                                            Sin documento: puede continuar con el registro del cliente.
                                        </motion.p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative py-1">
                            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200" />
                            <p className="relative mx-auto w-fit bg-slate-50 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                o buscar por nombre
                            </p>
                        </div>

                        <ClienteLookByName
                            setShowContratanteForm={setShowContratanteForm}
                            setSelectedTipoPersona={setSelectedTipoPersona}
                            setCliente1={setCliente1}
                        />
                    </form>
                </motion.div>
            </div>

            {(showContratanteForm || showClienteForm) && (
                <ContratanteClienteFormTransition
                    className="mt-10"
                    activeView={showClienteForm ? "cliente" : "contratante"}
                    contratante={
                        <CreateContratante
                            cliente1={cliente1}
                            setShowContratanteForm={setShowContratanteForm}
                            setShowClienteForm={setShowClienteForm}
                            setClientesCheck={setClientesCheck}
                            idtipoacto={idtipoacto}
                            idtipkar={idtipkar}
                            kardex={kardex}
                            selectedTipoPersona={selectedTipoPersona}
                        />
                    }
                    cliente={
                        cliente1 ? (
                            <UpdateCliente
                                setShowContratanteForm={setShowContratanteForm}
                                setShowClienteForm={setShowClienteForm}
                                setCliente1={setCliente1}
                                dni={document}
                                cliente1={cliente1}
                                selectedTipoDocumento={selectedTipoDocumento}
                                selectedTipoPersona={selectedTipoPersona}
                            />
                        ) : (
                            <CreateCliente
                                setShowContratanteForm={setShowContratanteForm}
                                setShowClienteForm={setShowClienteForm}
                                setCliente1={setCliente1}
                                dni={document}
                                cliente1={null}
                                selectedTipoPersona={selectedTipoPersona}
                                selectedTipoDocumento={selectedTipoDocumento}
                            />
                        )
                    }
                />
            )}
        </>
    )
}

export default PreClientForm
