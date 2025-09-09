import Calendar from "../../ui/Calendar";
import { useEffect, useState } from "react";
import SimpleSelector from "../../ui/SimpleSelector";
import useSearchSisgen from "../../../hooks/sisgen/useSearchSisgen";
import useAuthStore from "../../../store/useAuthStore";
import moment from "moment";
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService";

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
    setLoading
 }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    // const [isLoading, setIsLoading] = useState(false)

    const [selectedFromDate, setSelectedFromDate] = useState<Date | undefined>(undefined);
    const [selectedToDate, setSelectedToDate] = useState<Date | undefined>(undefined);

    const [errorDisplay, setErrorDisplay] = useState('');

    const searchSisgen = useSearchSisgen()

    useEffect(() => {
        if (searchId) {
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
                },
            }, {
                onSuccess: (data) => {
                    if (data.error === 0) {
                        setSisgenDocs(data.data);
                        setItemsCount(data.pagination.total_documents);
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
    }, [page])


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

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
            }
        }, {
            onSuccess: (data) => {
                if (data.error === 0) {
                    setSisgenDocs(data.data);
                    setItemsCount(data.pagination.total_documents);
                    setSearchId(data.pagination.search_id);
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

  return (
        <form
            onSubmit={handleSubmit}
            className="h-full">
            {errorDisplay && (
                <p className="text-red-500 text-center text-sm my-2">
                    {errorDisplay}
                </p>
            )}
            <div className="w-full flex justify-evenly items-center gap-4 my-6 h-full">
                <div className="w-full flex justify-evenly items-center">
                    <p className="font-semibold">Estado</p>
                    <SimpleSelector 
                        options={estadoSisgenOptions}
                        setter={setSelectedEstado}
                        defaultValue={selectedEstado}
                    />
                </div>
                <div className="w-full flex justify-evenly items-center">
                    <p className="font-semibold">Desde</p>
                    <Calendar 
                        selectedDate={selectedFromDate}
                        setSelectedDate={setSelectedFromDate}
                    />
                </div>
                <div className="w-full flex justify-evenly items-center">
                    <p className="font-semibold">Hasta</p>
                    <Calendar 
                        selectedDate={selectedToDate}
                        setSelectedDate={setSelectedToDate}
                    />
                </div>
                <button 
                    className="bg-blue-600 cursor-pointer text-sm text-white px-2 py-1 rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>
        </form>
  )
}

export default SisgenSearchForm