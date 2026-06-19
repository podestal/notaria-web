import { Loader2, Users } from "lucide-react"
import { useMutation, useQueryClient, useQueries } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetDocumentos from "../../../hooks/taxes/documentos/useGetDocumentos"
import useGetContratantesByKardex from "../../../hooks/api/contratantes/useGetContratantesByKardex"
import getCliente2Service, { type Cliente2 } from "../../../services/api/clienteService"
import type { Contratante } from "../../../services/api/contratantesService"
import { resolvePersonaFromContratante } from "../../../services/taxes/resolvePersonaFromContratante"
import type { CreateUpdatePersona, Persona } from "../../../services/taxes/personasService"
import getTitleCase from "../../../utils/getTitleCase"
import SimpleSelectorStr from "../../ui/SimpleSelectosStr"

interface Props {
    kardex: string
    juridicaOnly?: boolean
    onResolved: (persona: Persona, payload: CreateUpdatePersona) => void
    onError?: (message: string) => void
    disabled?: boolean
}

const PLACEHOLDER_VALUE = "0"

const isClienteJuridica = (cliente: Cliente2 | undefined): boolean => {
    if (!cliente) return false
    const digits = (cliente.numdoc || "").replace(/\D/g, "")
    return cliente.tipper === "J" || digits.length === 11
}

const IngresoContratanteSelector = ({
    kardex,
    juridicaOnly = false,
    onResolved,
    onError,
    disabled = false,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const queryClient = useQueryClient()
    const [selectedContratanteId, setSelectedContratanteId] = useState(PLACEHOLDER_VALUE)

    const {
        data: contratantes = [],
        isLoading: loadingContratantes,
        isError: contratantesError,
        error: contratantesFetchError,
    } = useGetContratantesByKardex({ kardex })
    const { data: documentos = [] } = useGetDocumentos({ access })

    const clienteQueries = useQueries({
        queries: contratantes.map((contratante) => ({
            queryKey: ["cliente2-by-contratante", contratante.idcontratante],
            queryFn: () =>
                getCliente2Service({ byContratante: true }).get(access, {
                    idcontratante: contratante.idcontratante,
                }),
            enabled: juridicaOnly && Boolean(access && contratante.idcontratante),
            staleTime: 5 * 60 * 1000,
        })),
    })

    const visibleContratantes = useMemo(() => {
        if (!juridicaOnly) return contratantes

        return contratantes.filter((_, index) =>
            isClienteJuridica(clienteQueries[index]?.data),
        )
    }, [contratantes, clienteQueries, juridicaOnly])

    const loadingJuridicaFilter =
        juridicaOnly &&
        contratantes.length > 0 &&
        clienteQueries.some((query) => query.isLoading)

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
            label:
                loadingContratantes || loadingJuridicaFilter
                    ? "Cargando contratantes…"
                    : "Seleccione…",
        },
        ...visibleContratantes.map((contratante: Contratante) => ({
            value: contratante.idcontratante,
            label: getContratanteLabel(contratante),
        })),
    ]

    const handleSelect = (value: string) => {
        setSelectedContratanteId(value)
        if (!value || value === PLACEHOLDER_VALUE) return
        resolveMutation.mutate(value)
    }

    const isBusy =
        disabled ||
        loadingContratantes ||
        loadingJuridicaFilter ||
        resolveMutation.isPending
    const selectedContratante = visibleContratantes.find(
        (contratante) => contratante.idcontratante === selectedContratanteId,
    )

    const showEmptyState =
        visibleContratantes.length === 0 &&
        !loadingContratantes &&
        !loadingJuridicaFilter &&
        !contratantesError

    const emptyMessage = juridicaOnly
        ? "No hay contratantes persona jurídica en este kardex."
        : "No hay contratantes registrados en este kardex."

    const emptyHint = juridicaOnly
        ? "Registre un contratante persona jurídica en la pestaña Contratantes del kardex, o elija «Otra persona jurídica» para buscar o crear el cliente manualmente."
        : "Registre contratantes en la pestaña Contratantes del kardex antes de emitir el comprobante, o complete la persona manualmente si el formulario lo permite."

    return (
        <div className="relative rounded-lg border border-sky-100 bg-sky-50/40 p-3">
            {contratantesError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium text-red-800">
                        No se pudieron cargar los contratantes
                    </p>
                    <p className="mt-1 text-xs text-red-700">
                        {contratantesFetchError instanceof Error
                            ? contratantesFetchError.message
                            : "Intente nuevamente o use la opción de persona manual."}
                    </p>
                </div>
            ) : (
                <>
            <SimpleSelectorStr
                key={`contratante-${kardex}-${visibleContratantes.length}-${juridicaOnly}`}
                label={
                    juridicaOnly
                        ? "Contratante jurídico del kardex"
                        : "Contratante del kardex"
                }
                options={contratanteOptions}
                defaultValue={selectedContratanteId}
                setter={handleSelect}
                disabled={isBusy || visibleContratantes.length === 0}
            />
            {showEmptyState && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                    <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                            <Users className="h-4 w-4" aria-hidden />
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-amber-950">
                                {emptyMessage}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-amber-900/90">
                                {emptyHint}
                            </p>
                        </div>
                    </div>
                </div>
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
                {juridicaOnly
                    ? "Solo se listan contratantes persona jurídica. Al seleccionar uno se usa su persona existente o se crea una nueva con sus datos."
                    : "Al seleccionar un contratante se usa su persona existente o se crea una nueva con sus datos."}
            </p>
                </>
            )}
        </div>
    )
}

const getContratanteLabel = (contratante: Contratante): string => {
    const name = getTitleCase(contratante.cliente || "Sin nombre")
    const condition = contratante.condicion_str?.trim()
    return condition ? `${name} — ${condition}` : name
}

export default IngresoContratanteSelector
