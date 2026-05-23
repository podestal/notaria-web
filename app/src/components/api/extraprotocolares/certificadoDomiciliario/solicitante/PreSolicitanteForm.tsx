import { useState } from "react";
import { Search, UserRoundPen } from "lucide-react";
import { documentNaturalOptions } from "../../../../../data/clienteData";
import axios from "axios";
import useAuthStore from "../../../../../store/useAuthStore";
import type { Cliente } from "../../../../../services/api/cliente1Service";
import {
    DNI_DOCUMENT_TYPE,
    sanitizeDniInput,
    validateDniDocument,
} from "../../../../../utils/cartaNotarialInput";
import { applyClienteToSolicitante } from "./applyClienteToSolicitante";

interface Props {
    setSolicitante: React.Dispatch<React.SetStateAction<string>>;
    setDomicilio: React.Dispatch<React.SetStateAction<string>>;
    setDistrito: React.Dispatch<React.SetStateAction<string>>;
    setProfesion: React.Dispatch<React.SetStateAction<string>>;
    setEstadoCivil: React.Dispatch<React.SetStateAction<number>>;
    setGenero: React.Dispatch<React.SetStateAction<string>>;
    selectedTipoDocumento: number;
    setSelectedTipoDocumento: React.Dispatch<React.SetStateAction<number>>;
    document: string;
    setDocument: React.Dispatch<React.SetStateAction<string>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    clienteFound: boolean;
    onClienteFound: (cliente: Cliente) => void;
    onClienteCleared: () => void;
    onOpenUpdateCliente: () => void;
    loadingUpdateCliente?: boolean;
}

const fieldClass =
    "w-full bg-white text-slate-700 border border-slate-300 rounded-lg py-2.5 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"

const labelClass = "text-xs font-semibold text-slate-700"

const PreSolicitanteForm = ({
    setSolicitante,
    setDomicilio,
    setDistrito,
    setProfesion,
    setEstadoCivil,
    setGenero,
    selectedTipoDocumento,
    setSelectedTipoDocumento,
    document,
    setDocument,
    setIsOpen,
    clienteFound,
    onClienteFound,
    onClienteCleared,
    onOpenUpdateCliente,
    loadingUpdateCliente = false,
}: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const [loading, setLoading] = useState(false);
    const [documentError, setDocumentError] = useState("");

    const solicitanteSetters = {
        setSolicitante,
        setDomicilio,
        setDistrito,
        setProfesion,
        setEstadoCivil,
        setGenero,
    }

    const handleDocumentChange = (value: string) => {
        const next =
            selectedTipoDocumento === DNI_DOCUMENT_TYPE
                ? sanitizeDniInput(value)
                : value
        setDocument(next)
        setDocumentError("")
        onClienteCleared()
    }

    const handleTipoDocumentoChange = (value: number) => {
        setSelectedTipoDocumento(value)
        if (value === DNI_DOCUMENT_TYPE) {
            setDocument((prev) => sanitizeDniInput(prev))
        }
        setDocumentError("")
        onClienteCleared()
    }

    const handleClienteLookup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!document.trim()) {
            setDocumentError("Ingrese el número de documento.")
            return
        }

        if (selectedTipoDocumento === DNI_DOCUMENT_TYPE) {
            const dniError = validateDniDocument(document)
            if (dniError) {
                setDocumentError(dniError)
                return
            }
        }

        setLoading(true);
        onClienteCleared()

        axios.get(
            `${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${document}`,
            {
                headers: {
                    'Authorization': `JWT ${access}`
                }
            }
        ).then(response => {
            if (response.data.idcliente) {
                applyClienteToSolicitante(response.data, solicitanteSetters)
                onClienteFound(response.data)
            } else {
                setIsOpen(true);
            }
        }).catch(error => {
            console.log('Error al buscar el cliente:', error);
            console.error(error);
        }).finally(() => {
            setLoading(false)
        })
    }

  return (
    <form
        className="mx-auto my-4 w-full"
        onSubmit={handleClienteLookup}
    >
        <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <p className="text-sm font-semibold text-slate-800">
                    Identificación del solicitante
                </p>
                {clienteFound && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                        Cliente encontrado
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4">
                    <label className={labelClass}>Tipo de documento</label>
                    <select
                        className={`sm:col-span-2 ${fieldClass}`}
                        value={selectedTipoDocumento}
                        onChange={(e) =>
                            handleTipoDocumentoChange(parseInt(e.target.value, 10))
                        }
                    >
                        {documentNaturalOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                    <label className={`${labelClass} sm:pt-2.5`}>Número de documento</label>
                    <div className="flex flex-col gap-3 sm:col-span-2">
                        <input
                            type="text"
                            inputMode={
                                selectedTipoDocumento === DNI_DOCUMENT_TYPE
                                    ? "numeric"
                                    : "text"
                            }
                            maxLength={
                                selectedTipoDocumento === DNI_DOCUMENT_TYPE ? 8 : undefined
                            }
                            value={document}
                            onChange={(e) => handleDocumentChange(e.target.value)}
                            placeholder={
                                selectedTipoDocumento === DNI_DOCUMENT_TYPE
                                    ? "8 dígitos"
                                    : "Ingrese el número de documento"
                            }
                            className={`${fieldClass} ${
                                documentError ? "border-red-500 focus:ring-red-300" : ""
                            }`}
                        />
                        {documentError && (
                            <p className="text-xs text-red-500 px-1">{documentError}</p>
                        )}
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                                type="submit"
                                disabled={loading || !document.trim()}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[7.5rem]"
                            >
                                <Search className="h-4 w-4 shrink-0" />
                                {loading ? "Buscando…" : "Buscar"}
                            </button>
                            <button
                                type="button"
                                disabled={!clienteFound || loadingUpdateCliente}
                                onClick={onOpenUpdateCliente}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[9.5rem]"
                            >
                                <UserRoundPen className="h-4 w-4 shrink-0" />
                                {loadingUpdateCliente ? "Cargando…" : "Actualizar cliente"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
  )
}

export default PreSolicitanteForm
