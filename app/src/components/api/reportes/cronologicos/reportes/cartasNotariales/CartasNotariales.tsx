import { useState } from "react"
import ReportHeader from "../../../../../ui/ReportHeader"
import ExtraProtocolaresHeader from "../../ExtraProtocolaresHeader"
import useAuthStore from "../../../../../../store/useAuthStore"
import useGetIngresoCartas from "../../../../../../hooks/api/extraprotocolares/ingresoCartas/useGetIngresoCartas"
import moment from "moment"
import Paginator from "../../../../../ui/Paginator"
import CartasNotarialesTable from "../../../../extraprotocolares/cartasNotariales/CartasNotarialesTable"

import ReportPageShell from "../../../../../ui/ReportPageShell"
import LoadingState from "../../../../../ui/LoadingState"
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
  return (
    <ReportPageShell>
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
      {isLoading && <LoadingState />}
      {isError && <p className="my-8 text-center text-sm text-red-600">Error: {error.message}</p>}
      {isSuccess && (
        <>
<CartasNotarialesTable 
          ingresoCartas={cartasPage.results}
          readyOnly={true}
          page={page}
          totalCount={cartasPage.count}
        />
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={cartasPage.count}
        />
        <>{console.log('cartasPage', cartasPage)}</>
        </>
      )}
</ReportPageShell>
  )
}

export default CartasNotariales