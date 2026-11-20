import { useState } from "react"
import { Loader2, Search } from "lucide-react"
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore"
import axios from "axios"
import useAuthStore from "../../../../../store/useAuthStore"

interface Props {
    selectedTipoPersona: number
    setSelectedTipoPersona: React.Dispatch<React.SetStateAction<number>>
    document: string
    setDocument: React.Dispatch<React.SetStateAction<string>>
    setApellidoPaterno: React.Dispatch<React.SetStateAction<string>>
    setApellidoMaterno: React.Dispatch<React.SetStateAction<string>>
    setPrimerNombre: React.Dispatch<React.SetStateAction<string>>
    setSegundoNombre: React.Dispatch<React.SetStateAction<string>>
    setDireccion: React.Dispatch<React.SetStateAction<string>>
    setRazonSocial: React.Dispatch<React.SetStateAction<string>>
    setDomicilioFiscal: React.Dispatch<React.SetStateAction<string>>
    setCodeCliente: React.Dispatch<React.SetStateAction<string>>
    setUbigeo: React.Dispatch<React.SetStateAction<string>>
    setOpenCreateCliente: React.Dispatch<React.SetStateAction<boolean>>
}

const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500"

const fieldClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"

const PreClienteForm = ({
    selectedTipoPersona,
    setSelectedTipoPersona,
    document,
    setDocument,
    setApellidoPaterno,
    setApellidoMaterno,
    setPrimerNombre,
    setSegundoNombre,
    setDireccion,
    setRazonSocial,
    setDomicilioFiscal,
    setCodeCliente,
    setUbigeo,
    setOpenCreateCliente,
}: Props) => {
    const access = useAuthStore((state) => state.access_token) || ""
    const { setMessage, setType, setShow } = useNotificationsStore()
    const [loading, setLoading] = useState(false)

    const canSearch = document.trim().length > 0 && !loading

    const handleSearch = () => {
        if (selectedTipoPersona === 0) {
            setMessage("Seleccione un tipo de persona")
            setType("error")
            setShow(true)
            return
        }

        if (selectedTipoPersona === 1 && document.length !== 8) {
            setMessage("Ingrese un documento válido")
            setType("error")
            setShow(true)
            return
        }

        const isCodju = document.toUpperCase().startsWith("CODJU")
        if (selectedTipoPersona === 2 && !isCodju && document.length !== 11) {
            setMessage("Ingrese un documento válido")
            setType("error")
            setShow(true)
            return
        }
        if (selectedTipoPersona === 2 && isCodju && !/^CODJU\d{6}$/i.test(document.trim())) {
            setMessage("Ingrese un código CODJU válido (ej. CODJU000001)")
            setType("error")
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
                        setApellidoPaterno(response.data.apepat)
                        setApellidoMaterno(response.data.apemat)
                        setPrimerNombre(response.data.prinom)
                        setSegundoNombre(response.data.segnom)
                        setDireccion(response.data.direccion)
                        setCodeCliente(response.data.idcliente)
                        setUbigeo(response.data.idubigeo)
                    } else {
                        console.log("Cliente no encontrado, creando nuevo cliente")
                        setOpenCreateCliente(true)
                    }
                })
                .catch((error) => {
                    console.log("Error al buscar el cliente:", error)
                    console.error(error)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else if (selectedTipoPersona === 2) {
            axios
                .get(`${import.meta.env.VITE_API_URL}cliente/by_ruc/?ruc=${document}`, {
                    headers: {
                        Authorization: `JWT ${access}`,
                    },
                })
                .then((response) => {
                    console.log(response.data)
                    if (response.data.idcliente) {
                        setRazonSocial(response.data.razonsocial || "")
                        setDomicilioFiscal(response.data.domfiscal || "")
                        setCodeCliente(response.data.idcliente)
                        setUbigeo(response.data.idubigeo || "")
                        const plantilla = (response.data.numdoc_plantilla || "").trim()
                        if (plantilla.toUpperCase().startsWith("CODJU")) {
                            setDocument(plantilla)
                        } else if (response.data.numdoc) {
                            setDocument(response.data.numdoc)
                        }
                    } else {
                        console.log("Cliente no encontrado, creando nuevo cliente")
                        setOpenCreateCliente(true)
                    }
                })
                .catch((error) => {
                    console.log("Error al buscar el cliente:", error)
                    console.error(error)
                })
                .finally(() => {
                    setLoading(false)
                })
        }

        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                <div className="w-full lg:max-w-[220px]">
                    <label className={labelClass} htmlFor="libros-tipo-persona">
                        Tipo de persona
                    </label>
                    <select
                        id="libros-tipo-persona"
                        value={selectedTipoPersona}
                        onChange={(e) =>
                            setSelectedTipoPersona(e.target.value ? parseInt(e.target.value) : 0)
                        }
                        className={`${fieldClass} cursor-pointer`}
                    >
                        <option value={0}>Seleccione…</option>
                        <option value={1}>Persona Natural</option>
                        <option value={2}>Persona Jurídica</option>
                    </select>
                </div>

                <div className="min-w-0 flex-1">
                    <label className={labelClass} htmlFor="libros-documento">
                        Documento
                    </label>
                    <input
                        id="libros-documento"
                        type="text"
                        value={document}
                        onChange={(e) => setDocument(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && canSearch) {
                                e.preventDefault()
                                handleSearch()
                            }
                        }}
                        placeholder={
                            selectedTipoPersona === 2 ? "RUC o CODJU…" : "DNI…"
                        }
                        className={fieldClass}
                        autoComplete="off"
                    />
                </div>

                <button
                    type="button"
                    disabled={!canSearch}
                    onClick={handleSearch}
                    className="inline-flex h-[38px] shrink-0 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    ) : (
                        <Search className="h-3.5 w-3.5" aria-hidden />
                    )}
                    {loading ? "Buscando" : "Buscar"}
                </button>
            </div>
        </div>
    )
}

export default PreClienteForm
