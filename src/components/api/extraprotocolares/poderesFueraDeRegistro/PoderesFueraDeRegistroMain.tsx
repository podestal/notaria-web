import { useState } from 'react'
import useGetIngresoPoderes from '../../../../hooks/api/extraprotocolares/ingresoPoderes/useGetIngresoPoderes'
import useAuthStore from '../../../../store/useAuthStore'
import GenericHeader from '../../../ui/GenericHeader'
import PoderesFueraDeRegistroFilters from './PoderesFueraDeRegistroFilters'
import PoderesFueraDeRegistroTable from './PoderesFueraDeRegistroTable'
import Paginator from '../../../ui/Paginator'
import TopModal from '../../../ui/TopModal'
import CreatePoderesFueraDeRegistro from './CreatePoderesFueraDeRegistro'

const PoderesFueraDeRegistroMain = () => {
    const access = useAuthStore(s => s.access_token) || ''
    const [open, setOpen] = useState(false)
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
    const [dateType, setDateType] = useState('1') // Assuming you want to manage a date type
    const [page, setPage] = useState(1)

    const { data: poderes, isLoading, error, isError, isSuccess, refetch } = useGetIngresoPoderes({ access, page, dateFrom, dateTo, dateType })

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando ...</p>
    if (isError) return <p className="text-center text-xs text-red-500 my-4">Error: {error.message}</p>

    if (isSuccess) 

  return (
    <>
      <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
          <GenericHeader 
            title="Poderes Fuera de Registro"
            setOpen={setOpen}
          />
          <PoderesFueraDeRegistroFilters 
            refetch={refetch}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            dateType={dateType}
            setDateType={setDateType}
            page={page}
          />
          <PoderesFueraDeRegistroTable 
            poderes={poderes}
          />        
          <Paginator
            page={page}
            setPage={setPage}
            itemsCount={poderes.count} 
          />
      </div>
      <TopModal
          isOpen={open}
          onClose={() => setOpen(false)}
      >
          <CreatePoderesFueraDeRegistro />
      </TopModal>
    </>
  )
}

export default PoderesFueraDeRegistroMain