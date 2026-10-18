import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import Calendar from "../../../ui/Calendar";
import { DomiciliarioPage } from "../../../../services/api/extraprotocolares/domiciliarioService";
import { useState } from "react";
import ExtraFiltersShell, {
    ExtraFilterField,
    ExtraFilterSearchButton,
    ExtraFilterTextField,
} from "../ExtraFiltersShell";

interface Props {
    dateFrom: Date | undefined;
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    dateTo: Date | undefined;
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>;
    crono: string;
    setCrono: React.Dispatch<React.SetStateAction<string>>;
    solicitante: string;
    setSolicitante: React.Dispatch<React.SetStateAction<string>>;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<DomiciliarioPage, Error>>
}

const DomiciliarioFilters = ({ 
    dateFrom, 
    setDateFrom, 
    dateTo, 
    setDateTo,
    crono, 
    setCrono,
    solicitante,
    setSolicitante,
    refetch,
 }: Props) => {
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
        <ExtraFilterTextField
            label="Solicitante"
            value={solicitante}
            onChange={setSolicitante}
            index={1}
        />
        <ExtraFilterField label="Fecha inicio" index={2}>
            <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} fullWidth />
        </ExtraFilterField>
        <ExtraFilterField label="Fecha fin" index={3}>
            <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} fullWidth />
        </ExtraFilterField>
        <ExtraFilterSearchButton loading={loading} index={4} colSpan={2} />
    </ExtraFiltersShell>
  )
}

export default DomiciliarioFilters
