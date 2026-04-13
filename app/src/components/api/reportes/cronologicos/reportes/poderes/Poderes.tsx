import { useState } from "react"
import useAuthStore from "../../../../../../store/useAuthStore"
import ReportHeader from "../../../../../ui/ReportHeader"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import useGetIngresoPoderes from "../../../../../../hooks/api/extraprotocolares/ingresoPoderes/useGetIngresoPoderes"
import moment from "moment"
import PoderesFueraDeRegistroTable from "../../../../extraprotocolares/poderesFueraDeRegistro/PoderesFueraDeRegistroTable"
import Paginator from "../../../../../ui/Paginator"


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

  if (isLoading) return <p className="text-center text-xs animate-pulse my-4 py-4">Cargando ...</p>;
  if (isError) return <p className="text-center text-xs text-red-500 my-4 py-4 ">Error: {error.message}</p>;
  if (isSuccess) 

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black py-6">
        <ReportHeader title="Indice Cronológico de Poderes Fuera de Registro" />
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
            fechade: moment(dateFrom).format('YYYY-MM-DD') || '',
            fechaa: moment(dateTo).format('YYYY-MM-DD') || '',
          }}
          name='reporte_ingreso_poderes'
        />
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
    </div>
  )
}

export default Poderes