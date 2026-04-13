import { useState } from 'react'
import useAuthStore from '../../../../../store/useAuthStore'
import ArchivosPdtHeader from '../ArchivosPdtHeader'
import useGetGarantiasPdt from '../../../../../hooks/api/kardex/pdt/useGetGarantiasPdt'
import ArchivosPdtKardexHeader from './ArchivosPdtKardexHeader'
import ArchivosPdtKardexBody from './ArchivosPdtKardexBody'
import Paginator from '../../../../ui/Paginator'
import moment from 'moment'

const ArchivosPdtGarantias = () => {
  const access = useAuthStore(s => s.access_token) || ''
  const [page, setPage] = useState<number>(1)

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const { data: garantiasPdt, isLoading, isError, error, isSuccess, refetch } = useGetGarantiasPdt({ access, page, dateFrom, dateTo })

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
                    // dateFrom={new Date(moment(dateFrom).format('YYYY-MM-DD') + 'T00:00:00.000Z')}
                    // dateTo={new Date(moment(dateTo).format('YYYY-MM-DD') + 'T23:59:59.999Z')}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    count={garantiasPdt.results.totalRecords} 
                    errors={garantiasPdt.results.totalError} 
                    refetch={refetch}
                    typeKardex={4}
                    typeKardexName="Garantias"
                />
                <ArchivosPdtKardexBody errors={garantiasPdt.results.list} />
                <Paginator page={page} setPage={setPage} itemsCount={garantiasPdt.count}/>
            </>
        )}
        {isError && (
            <div className="text-center text-red-500">{error.message}</div>
        )}
    </div>
  )
}

export default ArchivosPdtGarantias