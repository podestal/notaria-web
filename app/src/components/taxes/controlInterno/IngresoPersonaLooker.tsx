import { useEffect, useRef, useState } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useLookupPersonas from "../../../hooks/taxes/personas/useLookupPersonas"
import type { Persona } from "../../../services/taxes/personasService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    personaId: number
    personaDocumento: string
    personaNombre: string
    onSelect: (persona: Persona) => void
    onQueryChange: (query: string) => void
    onCreateRequest: (query: string) => void
    error?: string
}

const getPersonaDisplayName = (persona: Persona) => {
    if (persona.nombre_completo?.trim()) {
        return getTitleCase(persona.nombre_completo)
    }

    const parts = [
        persona.nombres,
        persona.apellido_paterno,
        persona.apellido_materno,
        persona.razon_social,
    ].filter(Boolean)

    return parts.length > 0 ? getTitleCase(parts.join(" ")) : "Sin nombre"
}

const IngresoPersonaLooker = ({
    personaId,
    personaDocumento,
    personaNombre,
    onSelect,
    onQueryChange,
    onCreateRequest,
    error = "",
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const containerRef = useRef<HTMLDivElement>(null)

    const [query, setQuery] = useState(
        personaId > 0 && personaDocumento
            ? `${personaDocumento} — ${getTitleCase(personaNombre)}`
            : personaDocumento,
    )
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedQuery(query.trim())
        }, 300)
        return () => window.clearTimeout(timeout)
    }, [query])

    useEffect(() => {
        if (personaId > 0 && personaDocumento) {
            setQuery(`${personaDocumento} — ${getTitleCase(personaNombre)}`)
        }
    }, [personaId, personaDocumento, personaNombre])

    const { data: results = [], isLoading, isError, error: fetchError } =
        useLookupPersonas({
            access,
            q: debouncedQuery,
            enabled: open && debouncedQuery.length > 0 && personaId <= 0,
        })

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleQueryChange = (value: string) => {
        setQuery(value)
        onQueryChange(value)
        setOpen(true)
    }

    const handleSelectPersona = (persona: Persona) => {
        onSelect(persona)
        setQuery(`${persona.numero_documento} — ${getPersonaDisplayName(persona)}`)
        setDebouncedQuery("")
        setOpen(false)
    }

    const showDropdown = open && debouncedQuery.length > 0 && personaId <= 0

    return (
        <div className="grid w-full grid-cols-3 items-start gap-6">
            <label className="pl-2 pt-2 text-xs font-semibold text-slate-700">
                Persona
            </label>
            <div ref={containerRef} className="relative col-span-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onFocus={() => setOpen(true)}
                    placeholder="Documento, nombres o apellidos…"
                    className={`min-w-64 w-full rounded-md border bg-white py-2 px-3 text-sm text-slate-700 outline-none focus:ring-2 ${
                        error
                            ? "border-red-500 focus:ring-red-300"
                            : "border-slate-300 focus:border-sky-400 focus:ring-sky-200"
                    }`}
                />

                {showDropdown && (
                    <ul className="absolute z-30 mt-1 max-h-52 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                        {isLoading && (
                            <li className="px-3 py-2 text-xs text-slate-500 animate-pulse">
                                Buscando…
                            </li>
                        )}

                        {isError && (
                            <li className="px-3 py-2 text-xs text-red-600">
                                {fetchError instanceof Error
                                    ? fetchError.message
                                    : "No se pudo buscar personas."}
                            </li>
                        )}

                        {!isLoading && !isError && results.length === 0 && (
                            <li className="px-3 py-2">
                                <p className="text-xs text-slate-500">
                                    No se encontraron personas.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onCreateRequest(debouncedQuery)
                                        setOpen(false)
                                    }}
                                    className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Registrar persona
                                </button>
                            </li>
                        )}

                        {!isLoading &&
                            results.map((persona) => (
                                <li key={persona.id_persona}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectPersona(persona)}
                                        className="w-full px-3 py-2 text-left hover:bg-sky-50"
                                    >
                                        <p className="font-mono text-[11px] font-semibold text-slate-600">
                                            {persona.numero_documento || "—"}
                                        </p>
                                        <p className="text-sm font-medium text-slate-900">
                                            {getPersonaDisplayName(persona)}
                                        </p>
                                    </button>
                                </li>
                            ))}
                    </ul>
                )}

                {error && (
                    <p className="mt-1 px-2 text-xs text-red-500">{error}</p>
                )}

                {personaId > 0 && personaNombre && (
                    <p className="mt-1 px-2 text-xs text-sky-800">
                        Seleccionado: {getTitleCase(personaNombre)}
                    </p>
                )}
            </div>
        </div>
    )
}

export default IngresoPersonaLooker
