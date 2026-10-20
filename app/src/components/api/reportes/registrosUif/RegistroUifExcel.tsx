import { FileSpreadsheet, Loader2 } from "lucide-react"
import moment from "moment"
import useAuthStore from "../../../../store/useAuthStore"
import { useState } from "react"
import { motion } from "framer-motion"
import { downloadUifExcelReport, type UifReportPolicy } from "../../../../services/uif/uifService"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"

interface Props {
  dateFrom: Date | undefined
  dateTo: Date | undefined
  reportPolicy: UifReportPolicy
}

const RegistroUifExcel = ({ dateFrom, dateTo, reportPolicy }: Props) => {
  const [loading, setLoading] = useState(false)
  const access = useAuthStore(s => s.access_token) || ''
  const { setMessage, setShow, setType } = useNotificationsStore()

  const handleDownload = async () => {
    if (!dateFrom || !dateTo) {
      setMessage('Selecciona fecha de inicio y fin')
      setShow(true)
      setType('error')
      return
    }

    setLoading(true)

    try {
      const data = await downloadUifExcelReport(access, dateFrom, dateTo, reportPolicy)
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `registro_uif_${moment(dateFrom).format('DD-MM-YYYY')}_to_${moment(dateTo).format('DD-MM-YYYY')}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      setMessage('No se pudo descargar el archivo Excel')
      setShow(true)
      setType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      whileHover={loading ? undefined : { y: -1 }}
      whileTap={loading ? undefined : { scale: 0.97 }}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
      {loading ? "Descargando…" : "Descargar Excel"}
    </motion.button>
  )
}

export default RegistroUifExcel
