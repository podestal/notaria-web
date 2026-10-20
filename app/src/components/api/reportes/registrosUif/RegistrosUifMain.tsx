import { useCallback, useState } from "react"
import { motion } from "framer-motion"
import { Shield } from "lucide-react"
import RegistroUifFilters from "./RegistroUifFilters"
import useAuthStore from "../../../../store/useAuthStore"
import useGetUifRegistro from "../../../../hooks/api/uif/useGetUifRegistro"
import RegistroUifBody from "./RegistroUifBody"
import type { UifReportPolicy } from "../../../../services/uif/uifService"
import type { UifTabId } from "../../../../services/uif/uifTypes"

import ReportPageShell from "../../../ui/ReportPageShell"
import ReportHeader from "../../../ui/ReportHeader"
import LoadingState from "../../../ui/LoadingState"

const RegistrosUifMain = () => {

  const access = useAuthStore(s => s.access_token) || ''

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [reportPolicy, setReportPolicy] = useState<UifReportPolicy>("all")
  const [activeTab, setActiveTab] = useState<UifTabId>("errors")
  const [page, setPage] = useState(1)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const { data: uifData, isLoading, isFetching, isError, error } = useGetUifRegistro({
    access,
    dateFrom,
    dateTo,
    activeTab,
    page,
    enabled: hasGenerated,
    refreshKey,
  })

  const handleGenerate = useCallback(() => {
    setPage(1)
    setActiveTab("errors")
    setHasGenerated(true)
    setRefreshKey((k) => k + 1)
  }, [])

  const handleTabChange = useCallback((tabId: UifTabId) => {
    setActiveTab(tabId)
    setPage(1)
  }, [])

  const showLoading = hasGenerated && (isLoading || isFetching)

  return (
    <ReportPageShell>
      <ReportHeader title="Registros UIF" subtitle="Generación del registro de operaciones UIF" />
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
      {showLoading && <LoadingState message="Generando registro…" description="Consultando operaciones UIF" />}

      {!hasGenerated && !showLoading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
            <Shield className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-sm font-medium text-slate-700">Genere el registro de operaciones</p>
          <p className="max-w-sm text-xs text-slate-400">
            Seleccione el rango de fechas y el tipo de registro, luego pulse Generar RO.
          </p>
        </motion.div>
      )}

      {isError && !showLoading && (
        <p className="my-10 text-center text-sm text-red-600">
          Error al cargar los datos {error?.message}
        </p>
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
    </ReportPageShell>
  )
}

export default RegistrosUifMain
