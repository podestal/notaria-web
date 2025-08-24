import { useState } from "react"
import useAuthStore from "../../../../../../store/useAuthStore"
import ReportHeader from "../../../../../ui/ReportHeader"
import useGetLibros from "../../../../../../hooks/api/extraprotocolares/aperturaLibros/useGetLibros"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import LibrosTable from "../../../../extraprotocolares/AperturaDeLibros/LibrosTable"
import Paginator from "../../../../../ui/Paginator"
import moment from "moment"



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

  const { data: librosPage, isLoading, isError, error, isSuccess, refetch } = useGetLibros({ access, page:1, dateFrom, dateTo })

  if (isLoading) return <p className="text-center text-xs animate-pulse my-4 py-4">Cargando ...</p>;
  if (isError) return <p className="text-center text-xs text-red-500 my-4 py-4 ">Error: {error.message}</p>;
  if (isSuccess) 

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black py-6">
        <ReportHeader title="Indice Cronológico de Cartas" />
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
        />
        <LibrosTable 
          libros={librosPage.results}
          readyOnly={true}
        />
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={librosPage.count}
        />
    </div>
  )
}

export default AperturaLibros