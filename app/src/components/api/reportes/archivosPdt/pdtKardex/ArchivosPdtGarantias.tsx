import { useState } from 'react'
import useAuthStore from '../../../../../store/useAuthStore'
import ArchivosPdtHeader from '../ArchivosPdtHeader'
import useGetGarantiasPdt from '../../../../../hooks/api/kardex/pdt/useGetGarantiasPdt'
import ArchivosPdtKardexHeader from './ArchivosPdtKardexHeader'
import ArchivosPdtKardexBody from './ArchivosPdtKardexBody'
import Paginator from '../../../../ui/Paginator'
import ReportHeader from "../../../../ui/ReportHeader"
import LoadingState from "../../../../ui/LoadingState"
import ReportPageShell from "../../../../ui/ReportPageShell"
const ArchivosPdtGarantias = () => {
  const access = useAuthStore(s => s.access_token) || ''
  const [page, setPage] = useState<number>(1)

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const { data: garantiasPdt, isLoading, isError, error, isSuccess, refetch } = useGetGarantiasPdt({ access, page, dateFrom, dateTo })

  return (
    <ReportPageShell>
      <ReportHeader title="Archivos PDT Garantías" subtitle="Generación de archivos PDT" />
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
                <ArchivosPdtKardexHeader 
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
            <p className="my-8 text-center text-sm text-red-600">{error.message}</p>
        )}
    </ReportPageShell>
  )
}

export default ArchivosPdtGarantias