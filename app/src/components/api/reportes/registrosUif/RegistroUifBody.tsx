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

  return (
    <div className="w-[85%] mx-auto mb-10 text-black">
       <RegistroUifSummary
            count={kardexRO.summary.total_kardex}
            totalErrors={kardexRO.summary.total_errors}
            dateFrom={dateFrom}
            dateTo={dateTo}
            reportPolicy={reportPolicy}
        />
       <KardexFormTabs
            key={activeTab}
            initialActiveTab={activeTab}
            setFilter={(tabId) => onTabChange(tabId as UifTabId)}
            tabs={[
                { id: 'errors', label: 'Lista de Errores', content: <ListaDeErrores kardexErrors={kardexRO.lista_errores} /> },
                { id: 'ro', label: 'Lista de Kardex (RO)', content: <ListaDeKardex kardexErrors={kardexRO.lista_kardex_ro} /> },
                { id: 'not_ro', label: 'Lista de Kardex que no envían', content: <ListaKardexNoEnvian kardexNoEnvian={kardexRO.lista_kardex_no_envian} /> },
            ]}
        />
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
