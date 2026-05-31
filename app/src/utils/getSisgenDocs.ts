import type { QueryClient } from "@tanstack/react-query"
import { UseMutationResult } from "@tanstack/react-query"
import moment from "moment"
import {
    cacheLastSisgenSearchRequest,
    type SisgenSearchHandlers,
} from "../hooks/sisgen/sisgenSearchKeys"
import { SearchSisgenData } from "../hooks/sisgen/useSearchSisgen"
import { SISGENDocument, SISGENSearchResponse } from "../services/sisgen/searchSisgenService"
import { applySisgenSearchResponse } from "./applySisgenSearchResponse"


interface Props {
    instrumentType: number
    selectedFromDate: Date | undefined
    selectedToDate: Date | undefined
    selectedEstado: number
    page: number
    setSisgenDocs: React.Dispatch<React.SetStateAction<SISGENDocument[]>>
    setItemsCount: React.Dispatch<React.SetStateAction<number>>
    setSearchId: React.Dispatch<React.SetStateAction<string>>
    setNoDocsMessage: React.Dispatch<React.SetStateAction<string>>
    setErrorDisplay: React.Dispatch<React.SetStateAction<string>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    access: string
    searchSisgen: UseMutationResult<SISGENSearchResponse, Error, SearchSisgenData>
    queryClient: QueryClient
    searchHandlers: SisgenSearchHandlers
}

const getSisgenDocs = ({
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
}: Props) => {

    setErrorDisplay('');
        
    if (!selectedFromDate) {
        setErrorDisplay('Por favor, seleccione una fecha de inicio.');
        return;
    }

    if (!selectedToDate) {
        setErrorDisplay('Por favor, seleccione una fecha de fin.');
        return;
    }

    if (selectedFromDate > selectedToDate) {
        setErrorDisplay('La fecha de inicio no puede ser posterior a la fecha de fin.');
        return;
    }

    console.log('selectedEstado', selectedEstado)

    setLoading(true)

    const variables: SearchSisgenData = {
        access,
        sisgen: {
            tipoInstrumento: instrumentType,
            fechaDesde: moment(selectedFromDate).format("YYYY-MM-DD"),
            fechaHasta: moment(selectedToDate).format("YYYY-MM-DD"),
            estado: selectedEstado,
            codigoActo: 0,
            page: page,
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

export default getSisgenDocs