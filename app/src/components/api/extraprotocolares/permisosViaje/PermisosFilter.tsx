import Calendar from "../../../ui/Calendar";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { PermisoViajePage } from "../../../../services/api/extraprotocolares/permisoViajeService";
import { useState } from "react";
import ExtraFiltersShell, {
    ExtraFilterField,
    ExtraFilterSearchButton,
    ExtraFilterSelectField,
    ExtraFilterTextField,
} from "../ExtraFiltersShell";

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        refetch().finally(() => {
            setLoading(false);
        });
    }

  return (
    <ExtraFiltersShell onSubmit={handleSubmit} columns={2}>
        <ExtraFilterTextField
            label="Cronológico"
            value={crono}
            onChange={setCrono}
            index={0}
        />
        <ExtraFilterSelectField
            label="Tipo permiso"
            value={tipoPermiso}
            onChange={setTipoPermiso}
            options={TIPO_PERMISO}
            index={1}
        />
        <ExtraFilterTextField
            label="Participante"
            value={nombreParticipante}
            onChange={setNombreParticipante}
            index={2}
        />
        <ExtraFilterTextField
            label="Nro control"
            value={numeroControl}
            onChange={setNumeroControl}
            index={3}
        />
        <ExtraFilterField label="Fecha inicio" index={4}>
            <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} fullWidth />
        </ExtraFilterField>
        <ExtraFilterField label="Fecha fin" index={5}>
            <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} fullWidth />
        </ExtraFilterField>
        <ExtraFilterSearchButton loading={loading} index={6} colSpan={2} />
    </ExtraFiltersShell>
  )
}

export default PermisosFilter
