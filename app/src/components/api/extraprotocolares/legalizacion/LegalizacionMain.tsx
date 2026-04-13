import { useState } from "react";
import GenericHeader from "../../../ui/GenericHeader"
import LegalizacionFilters from "./LegalizacionFilters"
import LegalizacionTable from "./LegalizacionTable"


const LegalizacionMain = () => {

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
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