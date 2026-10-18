
import { useEffect, useState } from 'react'
import ArchivosPdtHeader from '../ArchivosPdtHeader'
import ArchivosPdtLibrosHeader from './ArchivosPdtLibrosHeader'
import ArchivosPdtLibrosBody from './ArchivosPdtLibrosBody'
import useAuthStore from '../../../../../store/useAuthStore'
import useGetLibrosPdt from '../../../../../hooks/api/extraprotocolares/aperturaLibros/useGetLibrosPdt'
import Paginator from '../../../../ui/Paginator'

import ReportHeader from "../../../../ui/ReportHeader"
import LoadingState from "../../../../ui/LoadingState"
import ReportPageShell from "../../../../ui/ReportPageShell"

const ArchivosPdtLibros = () => {

    const access = useAuthStore(s => s.access_token) || ''
    const [page, setPage] = useState<number>(1)

    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setPage(1)
    }, [dateFrom, dateTo])

    const { data: librosPdt, isLoading, isError, error, isSuccess, refetch } = useGetLibrosPdt({ access, page, dateFrom, dateTo })

  return (
    <ReportPageShell>
      <ReportHeader title="Archivos PDT Libros" subtitle="Generación de archivos PDT" />
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
            <LoadingState message="Cargando PDT…" description="Consultando operaciones" />
        )}
        {isSuccess && (
            <>
                <ArchivosPdtLibrosHeader dateFrom={dateFrom} dateTo={dateTo} count={librosPdt.count} />
                <ArchivosPdtLibrosBody errors={librosPdt.results} />
                <Paginator page={page} setPage={setPage} itemsCount={librosPdt.count}/>
            </>
        )}
        {isError && (
            <p className="my-8 text-center text-sm text-red-600">{error.message}</p>
        )}
    </ReportPageShell>
  )
}

export default ArchivosPdtLibros