
import { useState } from 'react'
import ArchivosPdtHeader from '../ArchivosPdtHeader'
import ArchivosPdtLibrosHeader from './ArchivosPdtLibrosHeader'
import ArchivosPdtLibrosBody from './ArchivosPdtLibrosBody'
import useAuthStore from '../../../../../store/useAuthStore'
import useGetLibrosPdt from '../../../../../hooks/api/extraprotocolares/aperturaLibros/useGetLibrosPdt'

const ArchivosPdtLibros = () => {

    const access = useAuthStore(s => s.access_token) || ''
    const [page, setPage] = useState<number>(1)

    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false)

    const { data: librosPdt, isLoading, isError, error, isSuccess, refetch } = useGetLibrosPdt({ access, page, dateFrom, dateTo })

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
      <>{console.log(librosPdt)}</>
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
                <ArchivosPdtLibrosHeader dateFrom={dateFrom} dateTo={dateTo} count={librosPdt.count} />
                <ArchivosPdtLibrosBody />
            </>
        )}
        {isError && (
            <div className="text-center text-red-500">{error.message}</div>
        )}
    </div>
  )
}

export default ArchivosPdtLibros