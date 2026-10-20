import { FileDown, Loader2 } from 'lucide-react'
import useAuthStore from '../../../../../store/useAuthStore'
import useNotificationsStore from '../../../../../hooks/store/useNotificationsStore'
import axios from 'axios'
import moment from 'moment'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
    initialDate: Date | undefined
    finalDate: Date | undefined
}

const ArchivoPdtLibroDownload = ({ initialDate, finalDate }: Props) => {
    const access = useAuthStore( s => s.access_token) || ''
    const { setMessage, setShow, setType } = useNotificationsStore()
    const [isLoading, setIsLoading] = useState(false)

    const handleDownload = async () => {
        if (!initialDate) {
            setType('error')
            setMessage('Debe seleccionar una fecha inicial')
            setShow(true)
            return
        }

        if (!finalDate) {
            setType('error')
            setMessage('Debe seleccionar una fecha final')
            setShow(true)
            return
        }

        if (moment(initialDate).isAfter(moment(finalDate))) {
            setType('error')
            setMessage('La fecha inicial no puede ser mayor a la fecha final')
            setShow(true)
            return
        }

        if (moment(initialDate).isSame(moment(finalDate), 'day')) {
            setType('error')
            setMessage('La fecha inicial y la fecha final no pueden ser iguales')
            setShow(true)
            return
        }

        setIsLoading(true)

        try {
            const response = await axios({
                method: 'GET',
                url: `${import.meta.env.VITE_API_URL}kardex/pdt-file/`,
                params: {
                    initialDate: moment(initialDate).format('DD/MM/YYYY'),
                    finalDate: moment(finalDate).format('DD/MM/YYYY'),
                    fileType: 6,
                },
                responseType: 'blob',
                headers: {
                    'Authorization': `JWT ${access}`,
                    'Accept': '*/*'
                }
            })

            const blob = new Blob([response.data], { type: 'application/octet-stream' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url

            const contentDisposition = response.headers['content-disposition']
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : `PDT_${moment(initialDate).format('DDMMYYYY')}_${moment(finalDate).format('DDMMYYYY')}.lib`

            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()

            window.URL.revokeObjectURL(url)
            document.body.removeChild(link)

            setType('success')
            setMessage('Archivo descargado exitosamente')
            setShow(true)
        } catch (error: any) {
            setType('error')
            setMessage(error.response?.data?.error || 'Error al descargar el archivo')
            setShow(true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.button
            type="button"
            onClick={handleDownload}
            disabled={isLoading}
            whileHover={isLoading ? undefined : { y: -1 }}
            whileTap={isLoading ? undefined : { scale: 0.97 }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
        >
            {isLoading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <FileDown className="h-3.5 w-3.5" />}
            {isLoading ? "Descargando…" : "Descargar LIB"}
        </motion.button>
    )
}

export default ArchivoPdtLibroDownload
