import { useState } from 'react'
import ArchivosPdtHeader from '../ArchivosPdtHeader'
import useAuthStore from '../../../../../store/useAuthStore'
import useGetEscriturasPdt from '../../../../../hooks/api/kardex/pdt/useGetEscriturasPdt'
import ArchivosPdtKardexHeader from './ArchivosPdtKardexHeader'
import Paginator from '../../../../ui/Paginator'
import ArchivosPdtKardexBody from './ArchivosPdtKardexBody'

const ArchivosPdtEscrituras = () => {

  const access = useAuthStore(s => s.access_token) || ''
  const [page, setPage] = useState<number>(1)

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const { data: escriturasPdt, isLoading, isError, error, isSuccess, refetch } = useGetEscriturasPdt({ access, page, dateFrom, dateTo })

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
                <ArchivosPdtKardexHeader dateFrom={dateFrom} dateTo={dateTo} count={escriturasPdt.results.totalRecords} />
                <ArchivosPdtKardexBody errors={escriturasPdt.results.list} />
                <Paginator page={page} setPage={setPage} itemsCount={escriturasPdt.count}/>
            </>
        )}
        {isError && (
            <div className="text-center text-red-500">{error.message}</div>
        )}
        {/* {isLoading && (
            <div className="text-center animate-pulse text-xs ">Cargando...</div>
        )}
        {isSuccess && (
            <>
                <ArchivosPdtLibrosHeader dateFrom={dateFrom} dateTo={dateTo} count={librosPdt.count} />
                <ArchivosPdtLibrosBody errors={librosPdt.results} />
                <Paginator page={page} setPage={setPage} itemsCount={librosPdt.count}/>
            </>
        )}
        {isError && (
            <div className="text-center text-red-500">{error.message}</div>
        )} */}
    </div>
  )
}

export default ArchivosPdtEscrituras