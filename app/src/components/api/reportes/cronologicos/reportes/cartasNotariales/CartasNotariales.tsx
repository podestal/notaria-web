import { useState } from "react"
import ReportHeader from "../../../../../ui/ReportHeader"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import useAuthStore from "../../../../../../store/useAuthStore"
import useGetIngresoCartas from "../../../../../../hooks/api/extraprotocolares/ingresoCartas/useGetIngresoCartas"
import moment from "moment"
import Paginator from "../../../../../ui/Paginator"
import CartasNotarialesTable from "../../../../extraprotocolares/cartasNotariales/CartasNotarialesTable"

const CartasNotariales = () => {

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

  const { data: cartasPage, isLoading, isError, error, isSuccess, refetch } = useGetIngresoCartas({ access, page, dateFrom, dateTo })

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
          url='ingreso_cartas/reporte'
          params={{
            fechade: moment(dateFrom).format('DD/MM/YYYY') || '',
            fechaa: moment(dateTo).format('DD/MM/YYYY') || '',
          }}
          name='reporte_cartas'
        />
        <CartasNotarialesTable 
          ingresoCartas={cartasPage.results}
          readyOnly={true}
          page={page}
        />
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={cartasPage.count}
        />
        <>{console.log('cartasPage', cartasPage)}</>
    </div>
  )
}

export default CartasNotariales