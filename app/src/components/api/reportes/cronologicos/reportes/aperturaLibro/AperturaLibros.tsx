import { useState } from "react"
import useAuthStore from "../../../../../../store/useAuthStore"
import ReportHeader from "../../../../../ui/ReportHeader"
import useGetLibros from "../../../../../../hooks/api/extraprotocolares/aperturaLibros/useGetLibros"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import LibrosTable from "../../../../extraprotocolares/AperturaDeLibros/LibrosTable"
import Paginator from "../../../../../ui/Paginator"
import moment from "moment"



import ReportPageShell from "../../../../../ui/ReportPageShell"
import LoadingState from "../../../../../ui/LoadingState"
const AperturaLibros = () => {
  const access = useAuthStore(s => s.access_token) || ''
  const [page, setPage] = useState(1)
  const [dateFrom, setDateFrom] = useState<Date | undefined>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [dateTo, setDateTo] = useState<Date | undefined>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
  })
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')

  const { data: librosPage, isLoading, isError, error, isSuccess, refetch } = useGetLibros({ access, page:1, dateFrom, dateTo })
  return (
    <ReportPageShell>
        <ReportHeader title="Indice Cronológico de Libros" />
        <ExtraProtocolaresHeader 
          dateFrom={dateFrom} 
          dateTo={dateTo} 
          setDateFrom={setDateFrom} 
          setDateTo={setDateTo} 
          refetch={refetch}
          generatesWord={false}
          generatesExcel={false}
          url='libros/reporte'
          params={{
            fechade: moment(dateFrom).format('DD/MM/YYYY') || '',
            fechaa: moment(dateTo).format('DD/MM/YYYY') || '',
          }}
          name='reporte_libros'
          orientation={'horizontal'}
        />
      {isLoading && <LoadingState />}
      {isError && <p className="my-8 text-center text-sm text-red-600">Error: {error.message}</p>}
      {isSuccess && (
        <>
<LibrosTable 
          libros={librosPage.results}
          readyOnly={true}
          page={page}
          totalCount={librosPage.count}
        />
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={librosPage.count}
        />
        </>
      )}
</ReportPageShell>
  )
}

export default AperturaLibros