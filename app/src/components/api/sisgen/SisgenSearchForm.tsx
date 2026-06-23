import { useQueryClient } from "@tanstack/react-query";
import Calendar from "../../ui/Calendar";
import { useEffect } from "react";
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

    useEffect(() => {
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
    }, [page])


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log('selectedEstado', selectedEstado)

        getSisgenDocs({
            instrumentType,
            selectedFromDate,
            selectedToDate,
            selectedEstado,
            page,
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

    }

  return (
        <form onSubmit={handleSubmit} className="overflow-visible">
            {errorDisplay && (
                <p className="text-red-500 text-center text-sm my-2">
                    {errorDisplay}
                </p>
            )}
            <div className="my-6 flex w-full flex-wrap items-end justify-evenly gap-4 overflow-visible">
                <div className="flex min-w-[12rem] flex-1 flex-col gap-2 sm:max-w-xs">
                    <p className="text-sm font-semibold text-slate-700">Estado</p>
                    <SimpleSelector
                        options={estadoSisgenOptions}
                        setter={setSelectedEstado}
                        defaultValue={selectedEstado}
                    />
                </div>
                <div className="flex min-w-[12rem] flex-1 flex-col gap-2 sm:max-w-xs">
                    <p className="text-sm font-semibold text-slate-700">Desde</p>
                    <Calendar
                        selectedDate={selectedFromDate}
                        setSelectedDate={setSelectedFromDate}
                        fullWidth
                    />
                </div>
                <div className="flex min-w-[12rem] flex-1 flex-col gap-2 sm:max-w-xs">
                    <p className="text-sm font-semibold text-slate-700">Hasta</p>
                    <Calendar
                        selectedDate={selectedToDate}
                        setSelectedDate={setSelectedToDate}
                        fullWidth
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Buscando..." : "Buscar"}
                </button>
            </div>
        </form>
  )
}

export default SisgenSearchForm