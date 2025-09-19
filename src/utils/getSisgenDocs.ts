import moment from "moment"
import { SearchSisgenData } from "../hooks/sisgen/useSearchSisgen"
import { SISGENDocument, SISGENSearchResponse } from "../services/sisgen/searchSisgenService"
import { UseMutationResult } from "@tanstack/react-query"


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
    searchId: string
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
    searchId
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

    setLoading(true)

    searchSisgen.mutate({
        access,
        sisgen: {
            tipoInstrumento: instrumentType,
            fechaDesde: moment(selectedFromDate).format("YYYY-MM-DD"),
            fechaHasta: moment(selectedToDate).format("YYYY-MM-DD"),
            estado: selectedEstado,
            codigoActo: 0,
            page: page,
            search_id: searchId,
        }
    }, {
        onSuccess: (data) => {
            if (data.error === 0) {
                setSisgenDocs(data.data);
                setItemsCount(data.pagination.total_documents);
                setSearchId(data.pagination.search_id);
                if (data.data.length === 0) {
                    setNoDocsMessage('No se encontraron documentos SISGEN.')
                } else {
                    setNoDocsMessage('')
                }
            } else {
                setErrorDisplay(data.message || 'Error al buscar documentos SISGEN.');
            }
        },
        onError: (error) => {
            setErrorDisplay(error.message || 'Error al buscar documentos SISGEN.');
        },
        onSettled: () => {
            setLoading(false)
        }
    })

}

export default getSisgenDocs