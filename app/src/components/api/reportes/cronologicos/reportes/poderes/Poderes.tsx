import { useState } from "react"
import useAuthStore from "../../../../../../store/useAuthStore"
import ReportHeader from "../../../../../ui/ReportHeader"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import useGetIngresoPoderes from "../../../../../../hooks/api/extraprotocolares/ingresoPoderes/useGetIngresoPoderes"
import moment from "moment"
import PoderesFueraDeRegistroTable from "../../../../extraprotocolares/poderesFueraDeRegistro/PoderesFueraDeRegistroTable"
import Paginator from "../../../../../ui/Paginator"


import ReportPageShell from "../../../../../ui/ReportPageShell"
import LoadingState from "../../../../../ui/LoadingState"
const Poderes = () => {


  const [page, setPage] = useState(1)
  const access = useAuthStore(s => s.access_token) || ''
  const [dateFrom, setDateFrom] = useState<Date | undefined>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [dateTo, setDateTo] = useState<Date | undefined>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
  })

  const { data: poderesPage, isLoading, isError, error, isSuccess, refetch } = useGetIngresoPoderes({ access, page, dateFrom, dateTo })
  return (
    <ReportPageShell>
        <ReportHeader title="Indice Cronológico de Poderes Fuera de Registro" />
        <ExtraProtocolaresHeader 
          dateFrom={dateFrom} 
          dateTo={dateTo} 
          setDateFrom={setDateFrom} 
          setDateTo={setDateTo} 
          refetch={refetch}
          generatesWord={false}
          generatesExcel={false}
          url='poderes_fuerareg/reporte'
          params={{
            fechade: moment(dateFrom).format('DD/MM/YYYY') || '',
            fechaa: moment(dateTo).format('DD/MM/YYYY') || '',
          }}
          name='reporte_ingreso_poderes'
        />
      {isLoading && <LoadingState />}
      {isError && <p className="my-8 text-center text-sm text-red-600">Error: {error.message}</p>}
      {isSuccess && (
        <>
<PoderesFueraDeRegistroTable
          poderes={poderesPage}
          readyOnly={true}
          page={page}
        />
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={poderesPage.count}
        />
        {/* 
        <PermisosTable
          permisosPage={permisoViajesPage}
          readyOnly={true}
          // page={page}
        />
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={permisoViajesPage.count}
        /> */}
        </>
      )}
</ReportPageShell>
  )
}

export default Poderes