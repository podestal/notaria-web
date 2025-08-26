import { useState } from "react"
import ReportHeader from "../../../../../ui/ReportHeader"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import useAuthStore from "../../../../../../store/useAuthStore"
import useGetPermisosViaje from "../../../../../../hooks/api/extraprotocolares/permisosViaje/useGetPermisosViaje"
import moment from "moment"
import PermisosTable from "../../../../extraprotocolares/permisosViaje/PermisosTable"
import Paginator from "../../../../../ui/Paginator"

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

  if (isLoading) return <p className="text-center text-xs animate-pulse my-4 py-4">Cargando ...</p>;
  if (isError) return <p className="text-center text-xs text-red-500 my-4 py-4 ">Error: {error.message}</p>;
  if (isSuccess) 

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black py-6">
        <ReportHeader title="Indice Cronológico de Permisos de Viaje" />
        <ExtraProtocolaresHeader 
          dateFrom={dateFrom} 
          dateTo={dateTo} 
          setDateFrom={setDateFrom} 
          setDateTo={setDateTo} 
          refetch={refetch}
          generatesWord={false}
          generatesExcel={false}
          url='ingreso_cartas/reporte'
          params={{
            fechade: moment(dateFrom).format('DD/MM/YYYY') || '',
            fechaa: moment(dateTo).format('DD/MM/YYYY') || '',
          }}
          name='reporte_cartas'
        />
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
        {/* 
        <CartasNotarialesTable 
          ingresoCartas={cartasPage.results}
          readyOnly={true}
          page={page}
        />
        
        <>{console.log('cartasPage', cartasPage)}</> */}
    </div>
  )
}

export default PermisoViajes