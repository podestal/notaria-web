import Calendar from "../../../ui/Calendar"
import SingleSelect from "../../../ui/SingleSelect";

interface Props {
    dateFrom: Date | undefined;
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    dateTo: Date | undefined;
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>
    cronologico: string
    setCronologico: React.Dispatch<React.SetStateAction<string>>
}

const RegistroUifFilters = ({
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    cronologico,
    setCronologico
}: Props) => {
  return (
    <div>
        <h2 className="text-lg text-center font-semibold my-4">Información requerida para UIF:</h2>
        <div className="w-full grid grid-cols-3 gap-4 justify-center items-center text-center my-6">
            <div className="flex flex-col justify-center items-center gap-4 font-semibold text-sm">
                <p>Fecha Inicio</p>
                <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4 font-semibold text-sm">
                <p>Fecha Fin</p>
                <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} />
            </div>
            <SingleSelect 
                options={[{
                    value: 'cronologico',
                    label: 'Cronológico'
                }, {
                    value: 'alfabetico',
                    label: 'Alfabético'
                }]}
                selected={cronologico}
                onChange={setCronologico}
            />
        </div>
    
    </div>
  )
}

export default RegistroUifFilters