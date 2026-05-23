import { FileSpreadsheet, Loader2 } from "lucide-react"
import moment from "moment"
import useAuthStore from "../../../../store/useAuthStore"
import { useState } from "react"
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
    } catch (error) {
      console.error('Error downloading Excel file:', error)
      setMessage('No se pudo descargar el archivo Excel')
      setShow(true)
      setType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {loading ? (
        <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
      ) : (
        <FileSpreadsheet
          onClick={handleDownload}
          className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-700 transition-all duration-300"
        />
      )}
    </div>
  )
}

export default RegistroUifExcel
