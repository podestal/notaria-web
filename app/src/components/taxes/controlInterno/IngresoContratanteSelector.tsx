import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useGetDocumentos from "../../../hooks/taxes/documentos/useGetDocumentos"
import useGetContratantesByKardex from "../../../hooks/api/contratantes/useGetContratantesByKardex"
import type { Contratante } from "../../../services/api/contratantesService"
import { resolvePersonaFromContratante } from "../../../services/taxes/resolvePersonaFromContratante"
import type { CreateUpdatePersona, Persona } from "../../../services/taxes/personasService"
import getTitleCase from "../../../utils/getTitleCase"
import SimpleSelectorStr from "../../ui/SimpleSelectosStr"

interface Props {
    kardex: string
    onResolved: (persona: Persona, payload: CreateUpdatePersona) => void
    onError?: (message: string) => void
    disabled?: boolean
}

const PLACEHOLDER_VALUE = "0"

const IngresoContratanteSelector = ({
    kardex,
    onResolved,
    onError,
    disabled = false,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const queryClient = useQueryClient()
    const [selectedContratanteId, setSelectedContratanteId] = useState(PLACEHOLDER_VALUE)

    const { data: contratantes = [], isLoading: loadingContratantes } =
        useGetContratantesByKardex({ kardex })
    const { data: documentos = [] } = useGetDocumentos({ access })

    const resolveMutation = useMutation({
        mutationFn: (idcontratante: string) =>
            resolvePersonaFromContratante(access, idcontratante, documentos),
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ["taxes-personas"] })
            queryClient.invalidateQueries({ queryKey: ["taxes-personas-lookup"] })
            onResolved(result.persona, result.payload)
        },
        onError: (error) => {
            setSelectedContratanteId(PLACEHOLDER_VALUE)
            onError?.(
                error instanceof Error
                    ? error.message
                    : "No se pudo obtener la persona del contratante.",
            )
        },
    })

    const contratanteOptions = [
        {
            value: PLACEHOLDER_VALUE,
            label: loadingContratantes ? "Cargando contratantes…" : "Seleccione…",
        },
        ...contratantes.map((contratante: Contratante) => ({
            value: contratante.idcontratante,
            label: getContratanteLabel(contratante),
        })),
    ]

    const handleSelect = (value: string) => {
        setSelectedContratanteId(value)
        if (!value || value === PLACEHOLDER_VALUE) return
        resolveMutation.mutate(value)
    }

    const isBusy = disabled || loadingContratantes || resolveMutation.isPending
    const selectedContratante = contratantes.find(
        (contratante) => contratante.idcontratante === selectedContratanteId,
    )

    return (
        <div className="relative rounded-lg border border-sky-100 bg-sky-50/40 p-3">
            <SimpleSelectorStr
                key={`contratante-${kardex}-${contratantes.length}`}
                label="Contratante del kardex"
                options={contratanteOptions}
                defaultValue={selectedContratanteId}
                setter={handleSelect}
                disabled={isBusy || contratantes.length === 0}
            />
            {contratantes.length === 0 && !loadingContratantes && (
                <p className="mt-2 px-2 text-xs text-slate-500">
                    No hay contratantes registrados en este kardex.
                </p>
            )}
            {resolveMutation.isPending && (
                <div className="mt-3 flex items-start gap-3 rounded-lg border border-sky-200 bg-white px-3 py-2 shadow-sm">
                    <Loader2
                        className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-sky-600"
                        aria-hidden
                    />
                    <div>
                        <p className="text-xs font-semibold text-slate-800">
                            Cargando datos de facturación…
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                            Estamos buscando o creando la persona para{" "}
                            {selectedContratante
                                ? getTitleCase(selectedContratante.cliente)
                                : "el contratante seleccionado"}
                            .
                        </p>
                    </div>
                </div>
            )}
            <p className="mt-2 px-2 text-[11px] text-slate-500">
                Al seleccionar un contratante se usa su persona existente o se crea una
                nueva con sus datos.
            </p>
        </div>
    )
}

const getContratanteLabel = (contratante: Contratante): string => {
    const name = getTitleCase(contratante.cliente || "Sin nombre")
    const condition = contratante.condicion_str?.trim()
    return condition ? `${name} — ${condition}` : name
}

export default IngresoContratanteSelector
