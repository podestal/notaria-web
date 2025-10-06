import { useState } from "react"
import useAuthStore from "../../../../../../store/useAuthStore"
import useGetKardexList from "../../../../../../hooks/api/kardex/useGetKardexList"
import KardexTable from "../../../../kardex/KardexTable"
import moment from "moment"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import ReportHeader from "../../../../../ui/ReportHeader"

const NoContenciosos = () => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [dateTo, setDateTo] = useState<Date | undefined>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
  })
  const [page, setPage] = useState(1)
  const access = useAuthStore(s => s.access_token) || ''
  const {data: escrituras, isLoading, isError, error, isSuccess, refetch} = useGetKardexList({ page: page.toString(), idtipkar: 2, indexReport: 'yes', access, dateFrom, dateTo})

  if (isLoading) return <p className="text-sm animate-pulse text-center my-10">Un momento</p>
  if (isError) return <p>Error: {error.message}</p>
  if (isSuccess)
  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black py-6">
      <ReportHeader title="Indice Cronológico de Asuntos No Contenciosos" />
      <ExtraProtocolaresHeader 
        dateFrom={dateFrom} 
        dateTo={dateTo} 
        setDateFrom={setDateFrom} 
        setDateTo={setDateTo} 
        refetch={refetch}
        generatesWord={false}
        generatesExcel={false}
        url='kardex/no-contenciosos-cronologico'
        params={{
          initialDate: moment(dateFrom).format('YYYY-MM-DD') || '',
          finalDate: moment(dateTo).format('YYYY-MM-DD') || '',
        }}
        name='reporte_no_contenciosos'
      />
      <KardexTable 
        kardexPage={escrituras}
        setPage={setPage}
        page={page}
        readyOnly={true}
      />
  </div>
  )
}

export default NoContenciosos