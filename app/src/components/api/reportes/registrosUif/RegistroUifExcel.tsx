import { FileSpreadsheet, Loader2 } from "lucide-react"
import moment from "moment"
import useAuthStore from "../../../../store/useAuthStore"
import axios from "axios"
import { useState } from "react"

interface Props {
  dateFrom: Date | undefined
  dateTo: Date | undefined
}

const RegistroUifExcel = ({ dateFrom, dateTo }: Props) => {
  const [loading, setLoading] = useState(false)
  const access = useAuthStore(s => s.access_token) || ''

  const handleDownload = async () => {
    if (!dateFrom || !dateTo) {
      console.error('Date range is required')
      return
    }

    setLoading(true)
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}kardex/uif-report-excel/?initialDate=${moment(dateFrom).format('DD/MM/YYYY')}&finalDate=${moment(dateTo).format('DD/MM/YYYY')}`, 
        {
          headers: {
            'Authorization': `JWT ${access}`
          },
          responseType: 'arraybuffer' // Change to arraybuffer for binary data
        }
      )

      // The response.data is the raw Excel file data
      console.log('Response data type:', typeof response.data);
      console.log('Response data length:', response.data.byteLength);

      // Create blob from the raw Excel data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename with date range and .xlsx extension
      const excelFilename = `registro_uif_${moment(dateFrom).format('DD-MM-YYYY')}_to_${moment(dateTo).format('DD-MM-YYYY')}.xlsx`
      link.download = excelFilename
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('Excel file downloaded successfully')
    } catch (error) {
      console.error('Error downloading Excel file:', error)
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