import { File, Loader } from 'lucide-react'
import useAuthStore from '../../../../../store/useAuthStore'
import useNotificationsStore from '../../../../../hooks/store/useNotificationsStore'
import axios from 'axios'
import moment from 'moment'
import { useState } from 'react'

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

            // Create blob link to download
            const blob = new Blob([response.data], { type: 'application/octet-stream' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url

            // Get filename from response headers or create a default one
            const contentDisposition = response.headers['content-disposition']
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : `PDT_${moment(initialDate).format('DDMMYYYY')}_${moment(finalDate).format('DDMMYYYY')}.lib`

            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()

            // Cleanup
            window.URL.revokeObjectURL(url)
            document.body.removeChild(link)

            setType('success')
            setMessage('Archivo descargado exitosamente')
            setShow(true)
        } catch (error: any) {
            console.error('Error downloading file:', error.response || error)
            setType('error')
            setMessage(error.response?.data?.error || 'Error al descargar el archivo')
            setShow(true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
        
        {isLoading ? <Loader className="w-4 h-4 animate-spin text-blue-600" /> : <File 
            onClick={() => {
                if (isLoading) return
                handleDownload()
            }}
            className={`w-4 h-4 font-semibold text-blue-600 cursor-pointer hover:text-blue-700 transition-all duration-300 ${isLoading ? 'animate-pulse' : ''}`}
            
        />}

        </div>
    )
}

export default ArchivoPdtLibroDownload