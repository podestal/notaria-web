import { useState } from "react";
import useGetDomiciliarios from "../../../../../../hooks/api/extraprotocolares/domiciliario/useGetDomiciliarios";
import ReportHeader from "../../../../../ui/ReportHeader"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import moment from "moment";
import useAuthStore from "../../../../../../store/useAuthStore";
import DomiciliarioTable from "../../../../extraprotocolares/certificadoDomiciliario/DomiciliarioTable";
import Paginator from "../../../../../ui/Paginator";

const Domiciliario = () => {
  const access = useAuthStore(state => state.access_token) || '';
  const [dateFrom, setDateFrom] = useState<Date | undefined>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [dateTo, setDateTo] = useState<Date | undefined>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
  })
  const [page, setPage] = useState(1);
  
  const { data: domiciliariosPage, isLoading, isError, error, isSuccess, refetch } = useGetDomiciliarios({ access, page, dateFrom, dateTo })

  if (isLoading) return <p className="text-center text-xs animate-pulse my-4 py-4">Cargando ...</p>;
  if (isError) return <p className="text-center text-xs text-red-500 my-4 py-4 ">Error: {error.message}</p>;
  if (isSuccess) 

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black py-6">
    <ReportHeader title="Indice Cronológico de Certificados Domiciliarios" />
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
        fechade: moment(dateFrom).format('YYYY-MM-DD') || '',
        fechaa: moment(dateTo).format('YYYY-MM-DD') || '',
      }}
      name='reporte_cartas'
    />
    <DomiciliarioTable 
      domiciliarios={domiciliariosPage.results}
      page={page}
      readyOnly={true}
    />
    <Paginator
      page={page}
      setPage={setPage}
      itemsCount={domiciliariosPage.count}
    />
</div>
  )
}

export default Domiciliario