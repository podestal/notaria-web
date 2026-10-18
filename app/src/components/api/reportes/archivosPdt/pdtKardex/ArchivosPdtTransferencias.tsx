import { useState } from 'react'
import useGetVehicularesPdt from '../../../../../hooks/api/kardex/pdt/useGetVehicularesPdt'
import ArchivosPdtHeader from '../ArchivosPdtHeader'
import useAuthStore from '../../../../../store/useAuthStore'
import ArchivosPdtKardexHeader from './ArchivosPdtKardexHeader'
import ArchivosPdtKardexBody from './ArchivosPdtKardexBody'
import Paginator from '../../../../ui/Paginator'
import ReportHeader from "../../../../ui/ReportHeader"
import LoadingState from "../../../../ui/LoadingState"
import ReportPageShell from "../../../../ui/ReportPageShell"
// import moment from 'moment'

const ArchivosPdtTransferencias = () => {
  const access = useAuthStore(s => s.access_token) || ''
  const [page, setPage] = useState<number>(1)

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const { data: vehicularesPdt, isLoading, isError, error, isSuccess, refetch } = useGetVehicularesPdt({ access, page, dateFrom, dateTo })

  return (
    <ReportPageShell>
      <ReportHeader title="Archivos PDT Vehiculares" subtitle="Generación de archivos PDT" />
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
            <p className="my-8 text-center text-sm text-red-600">{error.message}</p>
        )}
    </ReportPageShell>
  )
}

export default ArchivosPdtTransferencias