import { useQueryClient } from "@tanstack/react-query";
import Calendar from "../../ui/Calendar";
import { useEffect, useRef } from "react";
import SimpleSelector from "../../ui/SimpleSelector";
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
import { AlertCircle, CalendarDays, Filter, Loader2, Search } from "lucide-react";

const estadoSisgenOptions = [
    { value: -1, label: "Todos los Documentos" },
    { value: 0, label: "No Enviado" },
    { value: 1, label: "Enviado" },
    { value: 2, label: "Enviado Observado" },
    { value: 3, label: "No Enviado Fallido" },
    { value: 4, label: "Sin Codigo Ancert" },
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
            <div className="flex w-full flex-wrap items-end gap-4 overflow-visible">
                <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <Filter className="h-3.5 w-3.5" /> Estado
                    </p>
                    <SimpleSelector
                        options={estadoSisgenOptions}
                        setter={setSelectedEstado}
                        defaultValue={selectedEstado}
                    />
                </div>
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