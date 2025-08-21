import { useState } from "react"
import RegistroUifFilters from "./RegistroUifFilters"


const RegistrosUifMain = () => {

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [cronologico, setCronologico] = useState<string>('')

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
      <RegistroUifFilters 
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        cronologico={cronologico}
        setCronologico={setCronologico}
      />
    </div>
  )
}

export default RegistrosUifMain