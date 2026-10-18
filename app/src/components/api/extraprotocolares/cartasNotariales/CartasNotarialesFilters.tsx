import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import Calendar from "../../../ui/Calendar"
import { IngresoCartasPage } from "../../../../services/api/extraprotocolares/ingresoCartas";
import { useState } from "react";
import ExtraFiltersShell, {
    ExtraFilterField,
    ExtraFilterSearchButton,
    ExtraFilterSelectField,
    ExtraFilterTextField,
} from "../ExtraFiltersShell";

interface Props {
    dateFrom: Date | undefined;
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    dateTo: Date | undefined;
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>;
    dateType: string;
    setDateType: React.Dispatch<React.SetStateAction<string>>;
    numCarta: string;
    setNumCarta: React.Dispatch<React.SetStateAction<string>>;
    remitente: string;
    setRemitente: React.Dispatch<React.SetStateAction<string>>;
    destinatario: string;
    setDestinatario: React.Dispatch<React.SetStateAction<string>>;
    page: number;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IngresoCartasPage, Error>>
}

const DATE_TYPE_OPTIONS = [
    { value: '1', label: 'Fecha Ingreso' },
    { value: '2', label: 'Fecha Diligencia' },
]

const CartasNotarialesFilters = ({
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    dateType,
    setDateType,
    numCarta,
    setNumCarta,
    remitente,
    setRemitente,
    destinatario,
    setDestinatario,
    refetch,
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
            label="Nº carta"
            value={numCarta}
            onChange={setNumCarta}
            index={0}
        />
        <ExtraFilterTextField
            label="Remitente"
            value={remitente}
            onChange={setRemitente}
            index={1}
        />
        <ExtraFilterTextField
            label="Destinatario"
            value={destinatario}
            onChange={setDestinatario}
            index={2}
        />
        <ExtraFilterSelectField
            label="Tipo fecha"
            value={dateType}
            onChange={setDateType}
            options={DATE_TYPE_OPTIONS}
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

export default CartasNotarialesFilters
