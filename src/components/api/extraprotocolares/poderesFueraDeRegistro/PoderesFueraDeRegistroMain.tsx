import { useState } from 'react'
import useGetIngresoPoderes from '../../../../hooks/api/extraprotocolares/ingresoPoderes/useGetIngresoPoderes'
import useAuthStore from '../../../../store/useAuthStore'
import GenericHeader from '../../../ui/GenericHeader'
import PoderesFueraDeRegistroFilters from './PoderesFueraDeRegistroFilters'
import PoderesFueraDeRegistroTable from './PoderesFueraDeRegistroTable'
import Paginator from '../../../ui/Paginator'

const PoderesFueraDeRegistroMain = () => {
    const access = useAuthStore(s => s.access_token) || ''
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
    const [page, setPage] = useState(1)

    const { data: poderes, isLoading, error, isError, isSuccess, refetch } = useGetIngresoPoderes({ access, page, dateFrom, dateTo })

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando ...</p>
    if (isError) return <p className="text-center text-xs text-red-500 my-4">Error: {error.message}</p>

    if (isSuccess) 

  return (
        <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
            <GenericHeader 
            title="Poderes Fuera de Registro"
            setOpen={() => {}}
            />
            <PoderesFueraDeRegistroFilters 
              refetch={refetch}
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
              page={page}
            />
            <PoderesFueraDeRegistroTable 
              refetch={refetch}
              poderes={poderes}
            />        
            <Paginator
              page={page}
              setPage={setPage}
              itemsCount={poderes.count} 
            />
        </div>
  )
}

export default PoderesFueraDeRegistroMain