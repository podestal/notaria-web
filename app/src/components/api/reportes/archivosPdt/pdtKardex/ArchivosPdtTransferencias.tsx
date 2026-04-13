import { useState } from 'react'
import useGetVehicularesPdt from '../../../../../hooks/api/kardex/pdt/useGetVehicularesPdt'
import ArchivosPdtHeader from '../ArchivosPdtHeader'
import useAuthStore from '../../../../../store/useAuthStore'
import ArchivosPdtKardexHeader from './ArchivosPdtKardexHeader'
import ArchivosPdtKardexBody from './ArchivosPdtKardexBody'
import Paginator from '../../../../ui/Paginator'
// import moment from 'moment'

const ArchivosPdtTransferencias = () => {
  const access = useAuthStore(s => s.access_token) || ''
  const [page, setPage] = useState<number>(1)

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const { data: vehicularesPdt, isLoading, isError, error, isSuccess, refetch } = useGetVehicularesPdt({ access, page, dateFrom, dateTo })

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">

        <ArchivosPdtHeader 
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            loading={loading}
            setLoading={setLoading}
            refetch={refetch}
        />
        {isLoading && (
            <div className="text-center animate-pulse text-xs ">Cargando...</div>
        )}
        {isSuccess && (
            <>
                <ArchivosPdtKardexHeader 
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    count={vehicularesPdt.results.totalRecords} 
                    errors={vehicularesPdt.results.totalError} 
                    refetch={refetch}
                    typeKardex={3}
                    typeKardexName="Transferencias"
                />
                <ArchivosPdtKardexBody errors={vehicularesPdt.results.list} />
                <Paginator page={page} setPage={setPage} itemsCount={vehicularesPdt.count}/>
            </>
        )}
        {isError && (
            <div className="text-center text-red-500">{error.message}</div>
        )}
    </div>
  )
}

export default ArchivosPdtTransferencias