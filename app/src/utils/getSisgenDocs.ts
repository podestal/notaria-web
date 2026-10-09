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

/**
 * Starts a new SISGEN search. New searches always request page 1.
 * Returns false when validation fails and no request was sent.
 */
const getSisgenDocs = ({
    instrumentType,
    selectedFromDate,
    selectedToDate,
    selectedEstado,
    setErrorDisplay,
    setLoading,
    access,
    searchSisgen,
    queryClient,
    searchHandlers,
}: Props): boolean => {

    setErrorDisplay('');
        
    if (!selectedFromDate) {
        setErrorDisplay('Por favor, seleccione una fecha de inicio.');
        return false;
    }

    if (!selectedToDate) {
        setErrorDisplay('Por favor, seleccione una fecha de fin.');
        return false;
    }

    if (selectedFromDate > selectedToDate) {
        setErrorDisplay('La fecha de inicio no puede ser posterior a la fecha de fin.');
        return false;
    }

    setLoading(true)

    const variables: SearchSisgenData = {
        access,
        sisgen: {
            tipoInstrumento: instrumentType,
            fechaDesde: moment(selectedFromDate).format("YYYY-MM-DD"),
            fechaHasta: moment(selectedToDate).format("YYYY-MM-DD"),
            estado: selectedEstado,
            codigoActo: 0,
            page: 1,
        },
    }

    cacheLastSisgenSearchRequest(
        queryClient.setQueryData.bind(queryClient),
        variables,
    )

    searchSisgen.mutate(variables, {
        onSuccess: (data) => {
            if (data.error !== 0) {
                searchHandlers.setErrorDisplay(
                    data.message || "Error al buscar documentos SISGEN.",
                )
                return
            }
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

    return true
}

export default getSisgenDocs
