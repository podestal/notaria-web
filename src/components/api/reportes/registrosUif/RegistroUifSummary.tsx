import moment from "moment"

// Set Spanish locale
moment.locale('es')

interface Props {
    count: number
    dateFrom: Date
    dateTo: Date
}

const spanishMonths = {
  0: 'Enero', 1: 'Febrero', 2: 'Marzo', 3: 'Abril',
  4: 'Mayo', 5: 'Junio', 6: 'Julio', 7: 'Agosto',
  8: 'Septiembre', 9: 'Octubre', 10: 'Noviembre', 11: 'Diciembre'
}

const RegistroUifSummary = ({ count, dateFrom, dateTo }: Props) => {
  const monthName = spanishMonths[dateFrom.getMonth() as keyof typeof spanishMonths]
  
  return (
    <>
    <h2 className="text-lg text-left font-semibold my-4 mx-6">Resumen de Operaciones UIF</h2>
    <div className="w-full text-sm grid grid-cols-5 gap-4 justify-center items-center text-center my-6 px-8 py-4 mx-6">
        <div className="flex flex-col justify-center items-start font-semibold gap-2">
            <h2>Mes</h2>
            <h2>Fecha</h2>
            <h2>Cantidad de Kardex</h2>
            <h2>Archivo Plano</h2>
            <h2>Archivo Excel</h2>
        </div>
        <div className="col-span-4 flex flex-col justify-center items-start gap-2">
            <h2>{moment(dateFrom).format('DD/MM/YYYY')} - {moment(dateTo).format('DD/MM/YYYY')}</h2>
            <h2>{monthName} - {moment(dateFrom).format('YYYY')}</h2>
            <h2>{count}</h2>
            <h2>-</h2>
            <h2>-</h2>
        </div>
    </div>
    </>
  )
}

export default RegistroUifSummary