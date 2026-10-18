import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import Calendar from "../../../ui/Calendar";
import { LibrosPage } from "../../../../services/api/extraprotocolares/librosService";
import { useState } from "react";
import ExtraFiltersShell, {
    ExtraFilterField,
    ExtraFilterSearchButton,
    ExtraFilterTextField,
} from "../ExtraFiltersShell";

interface Props {
    cliente: string;
    numDoc: string;
    cronologico: string;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    setCliente: React.Dispatch<React.SetStateAction<string>>;
    setNumDoc: React.Dispatch<React.SetStateAction<string>>;
    setCronologico: React.Dispatch<React.SetStateAction<string>>;
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>;
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<LibrosPage, Error>>
}

const LibrosFilters = ({ 
    cliente, 
    numDoc, 
    cronologico, 
    dateFrom, 
    dateTo, 
    setCliente, 
    setNumDoc, 
    setCronologico, 
    setDateFrom, 
    setDateTo,
    refetch
}: Props) => {
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        refetch().finally(() => setLoading(false))
    }

  return (
    <ExtraFiltersShell onSubmit={handleSubmit} columns={2}>
        <ExtraFilterTextField
            label="Empresa / Cliente"
            value={cliente}
            onChange={setCliente}
            index={0}
        />
        <ExtraFilterTextField
            label="DNI / RUC"
            value={numDoc}
            onChange={setNumDoc}
            index={1}
        />
        <ExtraFilterTextField
            label="Cronológico"
            value={cronologico}
            onChange={setCronologico}
            index={2}
        />
        <ExtraFilterField label="Fecha inicio" index={3}>
            <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} fullWidth />
        </ExtraFilterField>
        <ExtraFilterField label="Fecha fin" index={4}>
            <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} fullWidth />
        </ExtraFilterField>
        <ExtraFilterSearchButton loading={loading} index={5} colSpan={2} />
    </ExtraFiltersShell>
  )
}

export default LibrosFilters
