import { FileDown, Loader2 } from 'lucide-react'
import useAuthStore from '../../../../store/useAuthStore'
import { useState } from 'react'
import { motion } from 'framer-motion'
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
            const { blob, filename } = await downloadUifPlaneReport(
                access,
                dateFrom,
                dateTo,
                reportPolicy
            )
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch {
            setMessage('No se pudo descargar el archivo plano')
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
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70"
        >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
            {loading ? "Descargando…" : "Descargar plano"}
        </motion.button>
    )
}

export default RegistroUifPlaneText
