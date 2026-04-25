import { useState } from "react";
import GenericHeader from "../../../ui/GenericHeader"
import LegalizacionFilters from "./LegalizacionFilters"
import LegalizacionTable from "./LegalizacionTable"


const LegalizacionMain = () => {

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

  return (
    <div className="w-[92%] max-w-[1400px] mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 text-black mt-4 mb-4 overflow-hidden">
        <GenericHeader 
          title="Legalización de Firmas"
          setOpen={() => {}}
        />
        <LegalizacionFilters 
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />
        <LegalizacionTable 
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
    </div>
  )
}

export default LegalizacionMain