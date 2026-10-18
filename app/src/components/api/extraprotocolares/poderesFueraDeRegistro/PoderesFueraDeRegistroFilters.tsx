import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { IngresoPoderesPage } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import Calendar from "../../../ui/Calendar";
import { useEffect, useState } from "react";
import ExtraFiltersShell, {
    ExtraFilterField,
    ExtraFilterSearchButton,
    ExtraFilterSelectField,
} from "../ExtraFiltersShell";

interface Props {
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IngresoPoderesPage, Error>>
    dateFrom: Date | undefined;
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    dateTo: Date | undefined;
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>;
    dateType: string;
    setDateType: React.Dispatch<React.SetStateAction<string>>;
    page: number;
}

const DATE_TYPE_OPTIONS = [
    { value: '1', label: 'Fecha Ingreso' },
    { value: '2', label: 'Fecha Crono' },
]

const PoderesFueraDeRegistroFilters = ({
    refetch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    dateType,
    setDateType,
    page,
}: Props) => {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        refetch()
    }, [page])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        refetch().finally(() => setLoading(false))
    }

  return (
    <ExtraFiltersShell onSubmit={handleSubmit} columns={2} title="Búsqueda por fecha:">
        <ExtraFilterField label="Fecha inicio" index={0}>
            <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} fullWidth />
        </ExtraFilterField>
        <ExtraFilterField label="Fecha fin" index={1}>
            <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} fullWidth />
        </ExtraFilterField>
        <ExtraFilterSelectField
            label="Tipo fecha"
            value={dateType}
            onChange={setDateType}
            options={DATE_TYPE_OPTIONS}
            index={2}
        />
        <ExtraFilterSearchButton loading={loading} index={3} colSpan={1} />
    </ExtraFiltersShell>
  )
}

export default PoderesFueraDeRegistroFilters
