import { useState } from "react"
import useAuthStore from "../../../../../../store/useAuthStore"
import useGetKardexList from "../../../../../../hooks/api/kardex/useGetKardexList"
import KardexTable from "../../../../kardex/KardexTable"
import moment from "moment"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import ReportHeader from "../../../../../ui/ReportHeader"
import LoadingState from "../../../../../ui/LoadingState"

import ReportPageShell from "../../../../../ui/ReportPageShell"
const Testamentos = () => {
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
    const {data: escrituras, isLoading, isError, error, isSuccess, refetch} = useGetKardexList({ page: page.toString(), idtipkar: 5, indexReport: 'yes', access, dateFrom, dateTo})
  return (
    <ReportPageShell>
      <ReportHeader title="Indice Cronológico de Testamentos" />
      <ExtraProtocolaresHeader 
        dateFrom={dateFrom} 
        dateTo={dateTo} 
        setDateFrom={setDateFrom} 
        setDateTo={setDateTo} 
        refetch={refetch}
        generatesWord={false}
        generatesExcel={false}
        url='kardex/testamentos-cronologico'
        params={{
          initialDate: moment(dateFrom).format('YYYY-MM-DD') || '',
          finalDate: moment(dateTo).format('YYYY-MM-DD') || '',
        }}
        name='reporte_testamentos'
      />
      {isLoading && <LoadingState />}
      {isError && <p className="my-8 text-center text-sm text-red-600">Error: {error.message}</p>}
      {isSuccess && (
      <KardexTable 
        kardexPage={escrituras}
        setPage={setPage}
        page={page}
        readyOnly={true}
      />
      )}
  </ReportPageShell>
  )
}

export default Testamentos