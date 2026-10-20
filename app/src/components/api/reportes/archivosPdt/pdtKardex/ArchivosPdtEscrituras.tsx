import { useState } from 'react'
import ArchivosPdtHeader from '../ArchivosPdtHeader'
import useAuthStore from '../../../../../store/useAuthStore'
import useGetEscriturasPdt from '../../../../../hooks/api/kardex/pdt/useGetEscriturasPdt'
import ArchivosPdtKardexHeader from './ArchivosPdtKardexHeader'
import Paginator from '../../../../ui/Paginator'
import ArchivosPdtKardexBody from './ArchivosPdtKardexBody'
import ReportHeader from "../../../../ui/ReportHeader"
import LoadingState from "../../../../ui/LoadingState"
import ReportPageShell from "../../../../ui/ReportPageShell"
const ArchivosPdtEscrituras = () => {

  const access = useAuthStore(s => s.access_token) || ''
  const [page, setPage] = useState<number>(1)

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const { data: escriturasPdt, isLoading, isError, error, isSuccess, refetch } = useGetEscriturasPdt({ access, page, dateFrom, dateTo })

  return (
    <ReportPageShell>
      <ReportHeader title="Archivos PDT Escrituras" subtitle="Generación de archivos PDT" />
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
        {isSuccess && dateFrom && dateTo && (
            <>
                <ArchivosPdtKardexHeader 
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    count={escriturasPdt.results.totalRecords} 
                    errors={escriturasPdt.results.totalError} 
                    refetch={refetch}
                    typeKardex={1}
                    typeKardexName="Escrituras"
                />
                <ArchivosPdtKardexBody 
                    errors={escriturasPdt.results.list} 
                />
                <Paginator 
                    page={page} 
                    setPage={setPage} 
                    itemsCount={escriturasPdt.count}/>
            </>
        )}
        {isError && (
            <p className="my-8 text-center text-sm text-red-600">{error.message}</p>
        )}
    </ReportPageShell>
  )
}

export default ArchivosPdtEscrituras