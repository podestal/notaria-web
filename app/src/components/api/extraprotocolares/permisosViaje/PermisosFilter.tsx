import SimpleInput from "../../../ui/SimpleInput";
import Calendar from "../../../ui/Calendar";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { PermisoViajePage } from "../../../../services/api/extraprotocolares/permisoViajeService";
import SimpleSelectorStr from "../../../ui/SimpleSelectosStr";
import { useState } from "react";

const TIPO_PERMISO = [
    { value: '0', label: "Tipo Permiso" },
    { value: '001', label: "Interior" },
    { value: '002', label: "Exterior" },
]

interface Props {
    dateFrom: Date | undefined;
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    dateTo: Date | undefined;
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>;
    crono: string;
    setCrono: React.Dispatch<React.SetStateAction<string>>;
    tipoPermiso: string;
    setTipoPermiso: React.Dispatch<React.SetStateAction<string>>;
    nombreParticipante: string;
    setNombreParticipante: React.Dispatch<React.SetStateAction<string>>;
    numeroControl: string;
    setNumeroControl: React.Dispatch<React.SetStateAction<string>>;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<PermisoViajePage, Error>>
}

const PermisosFilter = ({ 
    dateFrom, 
    setDateFrom, 
    dateTo, 
    setDateTo,
    crono, 
    setCrono,
    tipoPermiso, 
    setTipoPermiso,
    nombreParticipante, 
    setNombreParticipante,
    numeroControl, 
    setNumeroControl, 
    refetch }: Props) => {

    const [loading, setLoading] = useState(false);

    const handleFilter = () => {
        setLoading(true);
        refetch().finally(() => {
            setLoading(false);
        });
    }

  return (
    <div>
        <div className="p-4 mb-4">
            <h2 className="text-lg text-center font-semibold my-4">Busqueda por:</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <SimpleInput
                    label="Cronológico"
                    value={crono}
                    setValue={setCrono}
                    horizontal
                />
                <SimpleSelectorStr
                    label="Tipo de Permiso"
                    options={TIPO_PERMISO}
                    defaultValue={tipoPermiso}
                    setter={setTipoPermiso}
                />

            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <SimpleInput
                    label="Nombre del Participante"
                    value={nombreParticipante}
                    setValue={setNombreParticipante}
                    horizontal
                />
                <SimpleInput
                    label="Nro Control"
                    value={numeroControl}
                    setValue={setNumeroControl}
                    horizontal
                />
            </div>
            <h2 className="text-lg text-center font-semibold my-4">Busqueda por Fecha Cronologico:</h2>
            <div className="w-full grid grid-cols-3 gap-4 justify-center items-center text-center my-6">
                <div className="flex flex-col justify-center items-center gap-4 font-semibold text-sm">
                    <p>Fecha Inicio</p>
                    <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} />
                </div>
                <div className="flex flex-col justify-center items-center gap-4 font-semibold text-sm">
                    <p>Fecha Fin</p>
                    <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} />
                </div>
                <div>
                    <button 
                        onClick={handleFilter}
                        className="bg-blue-500 text-white rounded-lg text-sm py-2 px-4 hover:bg-blue-600 cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PermisosFilter