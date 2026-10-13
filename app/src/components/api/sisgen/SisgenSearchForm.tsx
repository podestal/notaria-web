import { useQueryClient } from "@tanstack/react-query";
import Calendar from "../../ui/Calendar";
import { useEffect, useRef } from "react";
import {
    cacheLastSisgenSearchRequest,
    type SisgenSearchHandlers,
} from "../../../hooks/sisgen/sisgenSearchKeys";
import useSearchSisgen from "../../../hooks/sisgen/useSearchSisgen";
import useAuthStore from "../../../store/useAuthStore";
import moment from "moment";
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService";
import getSisgenDocs from "../../../utils/getSisgenDocs";
import { applySisgenSearchResponse } from "../../../utils/applySisgenSearchResponse";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    Clock,
    FileQuestion,
    Filter,
    Layers,
    Loader2,
    Search,
    XCircle,
    type LucideIcon,
} from "lucide-react";

const estadoSisgenOptions: {
    value: number
    label: string
    description: string
    icon: LucideIcon
    tone: { icon: string; active: string; dot: string }
}[] = [
    {
        value: -1, label: "Todos", description: "Todos los documentos", icon: Layers,
        tone: { icon: "bg-blue-50 text-blue-600", active: "border-blue-500 ring-blue-500/20", dot: "bg-blue-500" },
    },
    {
        value: 0, label: "No Enviado", description: "Pendientes de envío", icon: Clock,
        tone: { icon: "bg-slate-100 text-slate-600", active: "border-slate-500 ring-slate-500/20", dot: "bg-slate-500" },
    },
    {
        value: 1, label: "Enviado", description: "Aceptados por SISGEN", icon: CheckCircle2,
        tone: { icon: "bg-emerald-50 text-emerald-600", active: "border-emerald-500 ring-emerald-500/20", dot: "bg-emerald-500" },
    },
    {
        value: 2, label: "Enviado Observado", description: "Con observaciones", icon: AlertTriangle,
        tone: { icon: "bg-amber-50 text-amber-600", active: "border-amber-500 ring-amber-500/20", dot: "bg-amber-500" },
    },
    {
        value: 3, label: "No Enviado Fallido", description: "Envío con error", icon: XCircle,
        tone: { icon: "bg-red-50 text-red-600", active: "border-red-500 ring-red-500/20", dot: "bg-red-500" },
    },
    {
        value: 4, label: "Sin Código Ancert", description: "Acto sin código ANCERT", icon: FileQuestion,
        tone: { icon: "bg-orange-50 text-orange-600", active: "border-orange-500 ring-orange-500/20", dot: "bg-orange-500" },
    },
]

interface Props {
    instrumentType: number
    setSisgenDocs: React.Dispatch<React.SetStateAction<SISGENDocument[]>>
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    setItemsCount: React.Dispatch<React.SetStateAction<number>>
    searchId: string
    setSearchId: React.Dispatch<React.SetStateAction<string>>
    selectedEstado: number
    setSelectedEstado: React.Dispatch<React.SetStateAction<number>>
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setNoDocsMessage: React.Dispatch<React.SetStateAction<string>>
    selectedFromDate: Date | undefined
    setSelectedFromDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    selectedToDate: Date | undefined
    setSelectedToDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    setErrorDisplay: React.Dispatch<React.SetStateAction<string>>
    errorDisplay: string
    searchHandlers: SisgenSearchHandlers
}

const SisgenSearchForm = ({ 
    instrumentType, 
    setSisgenDocs, 
    page, 
    setPage,
    setItemsCount, 
    searchId,
    setSearchId,
    selectedEstado,
    setSelectedEstado,
    loading,
    setLoading,
    setNoDocsMessage,
    selectedFromDate,
    setSelectedFromDate,
    selectedToDate,
    setSelectedToDate,
    setErrorDisplay,
    errorDisplay,
    searchHandlers,
 }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const queryClient = useQueryClient()
    const searchSisgen = useSearchSisgen()
    const prevInstrumentTypeRef = useRef(instrumentType)
    const prevEstadoRef = useRef(selectedEstado)
    const skipPageFetchRef = useRef(false)

    const startNewSearch = (estado: number = selectedEstado) => {
        const started = getSisgenDocs({
            instrumentType,
            selectedFromDate,
            selectedToDate,
            selectedEstado: estado,
            setSisgenDocs,
            setItemsCount,
            setSearchId,
            setNoDocsMessage,
            setErrorDisplay,
            setLoading,
            access,
            searchSisgen,
            queryClient,
            searchHandlers,
        })

        if (started && page !== 1) {
            skipPageFetchRef.current = true
            setPage(1)
        }
    }

    useEffect(() => {
        if (prevEstadoRef.current === selectedEstado) return
        prevEstadoRef.current = selectedEstado

        if (selectedFromDate && selectedToDate) {
            startNewSearch(selectedEstado)
        }
    }, [selectedEstado])

    useEffect(() => {
        const instrumentChanged = prevInstrumentTypeRef.current !== instrumentType
        if (instrumentChanged) {
            prevInstrumentTypeRef.current = instrumentType

            if (selectedFromDate && selectedToDate) {
                startNewSearch()
            } else if (page !== 1) {
                skipPageFetchRef.current = true
                setPage(1)
            }
            return
        }

        if (skipPageFetchRef.current) {
            skipPageFetchRef.current = false
            return
        }

        if (searchId) {
            setLoading(true)
            setNoDocsMessage('')
            const variables = {
                access,
                sisgen: {
                    tipoInstrumento: instrumentType,
                    fechaDesde: moment(selectedFromDate).format("YYYY-MM-DD"),
                    fechaHasta: moment(selectedToDate).format("YYYY-MM-DD"),
                    estado: selectedEstado,
                    codigoActo: 0,
                    page: page,
                    search_id: searchId,
                },
            }

            cacheLastSisgenSearchRequest(
                queryClient.setQueryData.bind(queryClient),
                variables,
            )

            searchSisgen.mutate(variables, {
                onSuccess: (data) => {
                    applySisgenSearchResponse(data, searchHandlers)
                },
                onError: (error) => {
                    searchHandlers.setErrorDisplay(
                        error.message || "Error al buscar documentos SISGEN.",
                    )
                },
                onSettled: () => {
                    searchHandlers.setLoading(false)
                },
            })
        }
    }, [page, instrumentType])


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        startNewSearch()
    }

  return (
        <form onSubmit={handleSubmit} className="overflow-visible rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <AnimatePresence>
                {errorDisplay && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p>{errorDisplay}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <Filter className="h-3.5 w-3.5" /> Estado
            </p>
            <div role="radiogroup" aria-label="Estado SISGEN" className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                {estadoSisgenOptions.map((option, i) => {
                    const isActive = selectedEstado === option.value
                    const Icon = option.icon
                    return (
                        <motion.button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            disabled={loading}
                            onClick={() => setSelectedEstado(option.value)}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.04 }}
                            whileHover={loading ? undefined : { y: -2 }}
                            whileTap={loading ? undefined : { scale: 0.97 }}
                            className={`relative flex flex-col items-start gap-2 rounded-xl border bg-white p-3 text-left transition-shadow disabled:cursor-not-allowed disabled:opacity-60 ${
                                isActive
                                    ? `${option.tone.active} shadow-md ring-4`
                                    : "border-slate-200 shadow-sm hover:shadow-md"
                            }`}
                        >
                            <div className="flex w-full items-center justify-between">
                                <span className={`rounded-lg p-1.5 ${option.tone.icon}`}>
                                    <Icon className="h-4 w-4" />
                                </span>
                                {isActive && (
                                    <motion.span
                                        layoutId={`sisgen-estado-dot-${instrumentType}`}
                                        className={`h-2 w-2 rounded-full ${option.tone.dot}`}
                                    />
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-800">{option.label}</p>
                                <p className="text-[10px] text-slate-500">{option.description}</p>
                            </div>
                        </motion.button>
                    )
                })}
            </div>
            <div className="flex w-full flex-wrap items-end gap-4 overflow-visible">
                <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" /> Desde
                    </p>
                    <Calendar
                        selectedDate={selectedFromDate}
                        setSelectedDate={setSelectedFromDate}
                        fullWidth
                    />
                </div>
                <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" /> Hasta
                    </p>
                    <Calendar
                        selectedDate={selectedToDate}
                        setSelectedDate={setSelectedToDate}
                        fullWidth
                    />
                </div>
                <motion.button
                    type="submit"
                    whileHover={loading ? undefined : { y: -1 }}
                    whileTap={loading ? undefined : { scale: 0.97 }}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={loading}
                >
                    {loading
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Search className="h-4 w-4" />}
                    {loading ? "Buscando..." : "Buscar"}
                </motion.button>
            </div>
        </form>
  )
}

export default SisgenSearchForm