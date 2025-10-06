import moment from "moment"
import ReportHeader from "../../../../../ui/ReportHeader"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import { useState } from "react"
import useGetKardexList from "../../../../../../hooks/api/kardex/useGetKardexList"
import useAuthStore from "../../../../../../store/useAuthStore"
import KardexTable from "../../../../kardex/KardexTable"

// page: string
// idtipkar: number
// correlative?: string
// name?: string
// document?: string
// numescritura?: string
// noCorre?: string
// access: string
const EscriturasPublicas = () => {

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
  const {data: escrituras, isLoading, isError, error, isSuccess, refetch} = useGetKardexList({ page: page.toString(), idtipkar: 1, indexReport: 'yes', access})

  if (isLoading) return <p className="text-sm animate-pulse text-center my-10">Un momento</p>
  if (isError) return <p>Error: {error.message}</p>
  if (isSuccess)
  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black py-6">
      <ReportHeader title="Indice Cronológico de Escrituras Públicas" />
      <ExtraProtocolaresHeader 
        dateFrom={dateFrom} 
        dateTo={dateTo} 
        setDateFrom={setDateFrom} 
        setDateTo={setDateTo} 
        refetch={refetch}
        generatesWord={false}
        generatesExcel={false}
        url='cert_domiciliario/reporte'
        params={{
          fechade: moment(dateFrom).format('DD/MM/YYYY') || '',
          fechaa: moment(dateTo).format('DD/MM/YYYY') || '',
        }}
        name='reporte_domiciliario'
      />
      <KardexTable 
        kardexPage={escrituras}
        setPage={setPage}
        page={page}
      />

      {/* 
      <DomiciliarioTable 
        domiciliarios={domiciliariosPage.results}
        page={page}
        readyOnly={true}
      />
      <Paginator
        page={page}
        setPage={setPage}
        itemsCount={domiciliariosPage.count}
      /> */}
  </div>
  )
}

export default EscriturasPublicas