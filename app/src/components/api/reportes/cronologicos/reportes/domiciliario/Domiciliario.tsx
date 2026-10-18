import { useState } from "react";
import useGetDomiciliarios from "../../../../../../hooks/api/extraprotocolares/domiciliario/useGetDomiciliarios";
import ReportHeader from "../../../../../ui/ReportHeader"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import moment from "moment";
import useAuthStore from "../../../../../../store/useAuthStore";
import DomiciliarioTable from "../../../../extraprotocolares/certificadoDomiciliario/DomiciliarioTable";
import Paginator from "../../../../../ui/Paginator";

import ReportPageShell from "../../../../../ui/ReportPageShell"
import LoadingState from "../../../../../ui/LoadingState"
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
  return (
    <ReportPageShell>
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
          fechade: moment(dateFrom).format('DD/MM/YYYY') || '',
          fechaa: moment(dateTo).format('DD/MM/YYYY') || '',
        }}
        name='reporte_domiciliario'
      />
      {isLoading && <LoadingState />}
      {isError && <p className="my-8 text-center text-sm text-red-600">Error: {error.message}</p>}
      {isSuccess && (
        <>
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
        </>
      )}
</ReportPageShell>
  )
}

export default Domiciliario