import { useState } from "react"
import ReportHeader from "../../../../../ui/ReportHeader"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import useAuthStore from "../../../../../../store/useAuthStore"
import useGetPermisosViaje from "../../../../../../hooks/api/extraprotocolares/permisosViaje/useGetPermisosViaje"
import moment from "moment"
import PermisosTable from "../../../../extraprotocolares/permisosViaje/PermisosTable"
import Paginator from "../../../../../ui/Paginator"

import ReportPageShell from "../../../../../ui/ReportPageShell"
import LoadingState from "../../../../../ui/LoadingState"
const PermisoViajes = () => {

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

  const { data: permisoViajesPage, isLoading, isError, error, isSuccess, refetch } = useGetPermisosViaje({ access, page, dateFrom, dateTo })
  return (
    <ReportPageShell>
        <ReportHeader title="Indice Cronológico de Permisos de Viaje" />
        <ExtraProtocolaresHeader 
          dateFrom={dateFrom} 
          dateTo={dateTo} 
          setDateFrom={setDateFrom} 
          setDateTo={setDateTo} 
          refetch={refetch}
          generatesWord={false}
          generatesExcel={false}
          url='permi_viaje/reporte'
          params={{
            fechade: moment(dateFrom).format('DD/MM/YYYY') || '',
            fechaa: moment(dateTo).format('DD/MM/YYYY') || '',
          }}
          name='reporte_permisos_viaje'
        />
      {isLoading && <LoadingState />}
      {isError && <p className="my-8 text-center text-sm text-red-600">Error: {error.message}</p>}
      {isSuccess && (
        <>
<PermisosTable
          permisosPage={permisoViajesPage}
          readyOnly={true}
          // page={page}
        />
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={permisoViajesPage.count}
        />
        </>
      )}
</ReportPageShell>
  )
}

export default PermisoViajes