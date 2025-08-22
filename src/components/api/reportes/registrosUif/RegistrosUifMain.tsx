import { useState } from "react"
import RegistroUifFilters from "./RegistroUifFilters"
import useAuthStore from "../../../../store/useAuthStore"
import useGetUifErrors from "../../../../hooks/api/kardex/useGetUifErrors"
import RegistroUifBody from "./RegistroUifBody"


const RegistrosUifMain = () => {

  const access = useAuthStore(s => s.access_token) || ''

  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date())
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date())
  const [cronologico, setCronologico] = useState<string>('')
  const [listType, setListType] = useState<string>('errors')
  const [page, setPage] = useState<number>(1)

  const { data: uifErrors, isLoading, isError, error, isSuccess, refetch } = useGetUifErrors({ access, page, listType, dateFrom, dateTo, cronologico })


   

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
      <>{console.log(listType)}</>
      <RegistroUifFilters 
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        cronologico={cronologico}
        setCronologico={setCronologico}
        refetch={refetch}
      />
        {isLoading && <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg my-10 text-black text-center">Cargando...</div>}

        {isError && <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg my-10 text-black text-center">Error al cargar los datos</div>}

        {isSuccess &&
      <RegistroUifBody 
        listType={listType}
        setListType={setListType}
        kardexRO={uifErrors.results}
      />}
    </div>
  )
}

export default RegistrosUifMain