import { FileText, Loader2 } from 'lucide-react'
import useAuthStore from '../../../../store/useAuthStore'
import moment from 'moment'
import { useState } from 'react'
import { downloadUifPlaneReport, type UifReportPolicy } from '../../../../services/uif/uifService'
import useNotificationsStore from '../../../../hooks/store/useNotificationsStore'

interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
    reportPolicy: UifReportPolicy
}

const RegistroUifPlaneText = ({ dateFrom, dateTo, reportPolicy }: Props) => {
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
            const blob = await downloadUifPlaneReport(access, dateFrom, dateTo, reportPolicy)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `registro_uif_${moment(dateFrom).format('DD-MM-YYYY')}_to_${moment(dateTo).format('DD-MM-YYYY')}.txt`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error downloading file:', error)
            setMessage('No se pudo descargar el archivo plano')
            setShow(true)
            setType('error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            {loading ? (
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            ) : (
                <FileText
                    onClick={handleDownload}
                    className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-700 transition-all duration-300"
                />
            )}
        </div>
    )
}

export default RegistroUifPlaneText
