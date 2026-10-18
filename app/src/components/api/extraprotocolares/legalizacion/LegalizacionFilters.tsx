import Calendar from "../../../ui/Calendar";
import ExtraFiltersShell, {
    ExtraFilterField,
    ExtraFilterSearchButton,
} from "../ExtraFiltersShell";

interface Props {
    dateFrom: Date | undefined;
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    dateTo: Date | undefined;
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

const LegalizacionFilters = ({ dateFrom, setDateFrom, dateTo, setDateTo }: Props ) => {
    const handleCleanFilters = () => {
        setDateFrom(undefined);
        setDateTo(undefined);
    }

  return (
    <ExtraFiltersShell columns={2} title="Búsqueda por fecha:">
        <ExtraFilterField label="Fecha inicio" index={0}>
            <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} fullWidth />
        </ExtraFilterField>
        <ExtraFilterField label="Fecha fin" index={1}>
            <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} fullWidth />
        </ExtraFilterField>
        <ExtraFilterSearchButton
            type="button"
            variant="clear"
            label="Limpiar"
            onClick={handleCleanFilters}
            index={2}
            colSpan={2}
        />
    </ExtraFiltersShell>
  )
}

export default LegalizacionFilters
