import { useCallback, useState } from "react"
import RegistroUifFilters from "./RegistroUifFilters"
import useAuthStore from "../../../../store/useAuthStore"
import useGetUifRegistro from "../../../../hooks/api/uif/useGetUifRegistro"
import RegistroUifBody from "./RegistroUifBody"
import type { UifReportPolicy } from "../../../../services/uif/uifService"
import type { UifTabId } from "../../../../services/uif/uifTypes"

const RegistrosUifMain = () => {

  const access = useAuthStore(s => s.access_token) || ''

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [reportPolicy, setReportPolicy] = useState<UifReportPolicy>("all")
  const [activeTab, setActiveTab] = useState<UifTabId>("errors")
  const [page, setPage] = useState(1)
  const [hasGenerated, setHasGenerated] = useState(false)

  const { data: uifData, isLoading, isFetching, isError, error, isSuccess } = useGetUifRegistro({
    access,
    dateFrom,
    dateTo,
    activeTab,
    page,
    enabled: hasGenerated,
  })

  const handleGenerate = useCallback(() => {
    setPage(1)
    setActiveTab("errors")
    setHasGenerated(true)
  }, [])

  const handleTabChange = useCallback((tabId: UifTabId) => {
    setActiveTab(tabId)
    setPage(1)
  }, [])

  const showLoading = hasGenerated && (isLoading || isFetching)

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
      <RegistroUifFilters
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        reportPolicy={reportPolicy}
        setReportPolicy={setReportPolicy}
        onGenerate={handleGenerate}
        isLoading={isLoading || isFetching}
      />
      {showLoading && (
        <div className="my-10 text-black text-center">Cargando...</div>
      )}

      {isError && !showLoading && (
        <div className="my-10 text-black text-center">
          Error al cargar los datos {error?.message}
        </div>
      )}

      {uifData && !showLoading && (
        <RegistroUifBody
          kardexRO={uifData.results}
          itemsCount={uifData.count}
          dateFrom={dateFrom}
          dateTo={dateTo}
          reportPolicy={reportPolicy}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          page={page}
          setPage={setPage}
        />
      )}
    </div>
  )
}

export default RegistrosUifMain
