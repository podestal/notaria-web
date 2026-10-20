import { KardexRO } from '../../../../services/api/kardexService'
import type { UifReportPolicy } from '../../../../services/uif/uifService'
import { UIF_PAGE_SIZE } from '../../../../services/uif/uifService'
import type { UifTabId } from '../../../../services/uif/uifTypes'
import KardexFormTabs from '../../kardex/KardexFormTabs'
import Paginator from '../../../ui/Paginator'
import ListaDeErrores from './registroTabs/ListaDeErrores'
import ListaDeKardex from './registroTabs/ListaDeKardex'
import ListaKardexNoEnvian from './registroTabs/ListaKardexNoEnvian'
import RegistroUifSummary from './RegistroUifSummary'

interface Props {
    kardexRO: KardexRO
    itemsCount: number
    dateFrom: Date | undefined
    dateTo: Date | undefined
    reportPolicy: UifReportPolicy
    activeTab: UifTabId
    onTabChange: (tabId: UifTabId) => void
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
}

const RegistroUifBody = ({
    kardexRO,
    itemsCount,
    dateFrom,
    dateTo,
    reportPolicy,
    activeTab,
    onTabChange,
    page,
    setPage,
}: Props) => {
  const errorsCount = kardexRO.lista_errores?.length ?? 0
  const roCount = kardexRO.lista_kardex_ro?.length ?? 0
  const noRoCount = kardexRO.lista_kardex_no_envian?.length ?? 0

  return (
    <div className="mb-2 text-slate-800">
       <RegistroUifSummary
            count={kardexRO.summary?.total_kardex ?? 0}
            totalErrors={kardexRO.summary?.total_errors ?? 0}
            dateFrom={dateFrom}
            dateTo={dateTo}
            reportPolicy={reportPolicy}
        />
       <div className="px-4 sm:px-6">
       <KardexFormTabs
            key={activeTab}
            initialActiveTab={activeTab}
            setFilter={(tabId) => onTabChange(tabId as UifTabId)}
            tabs={[
                { id: 'errors', label: `Lista de errores (${errorsCount})`, content: <ListaDeErrores kardexErrors={kardexRO.lista_errores} /> },
                { id: 'ro', label: `Lista de kardex RO (${roCount})`, content: <ListaDeKardex kardexErrors={kardexRO.lista_kardex_ro} /> },
                { id: 'not_ro', label: `Kardex que no envían (${noRoCount})`, content: <ListaKardexNoEnvian kardexNoEnvian={kardexRO.lista_kardex_no_envian} /> },
            ]}
        />
       </div>
        <Paginator
            page={page}
            setPage={setPage}
            itemsCount={itemsCount}
            itemsPerPage={UIF_PAGE_SIZE}
        />
    </div>
  )
}

export default RegistroUifBody
