import { File, Loader } from "lucide-react"
import axios from "axios"
import moment from "moment"
import { useState } from "react"
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore"
import useAuthStore from "../../../../../store/useAuthStore"

interface Props {
    initialDate: Date | undefined
    finalDate: Date | undefined
    typeKardex: number
}

const ArchivoPdtKardexFiles = ({ initialDate, finalDate, typeKardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const [isLoading, setIsLoading] = useState(false)
    const { setType, setMessage, setShow } = useNotificationsStore()

    const handleDownload = async ({ fileType }: { fileType: number }) => {

        if (!initialDate || !finalDate) {
            setType('error')
            setMessage('Por favor seleccione las fechas')
            setShow(true)
            return
        }

        // Additional validation to check for invalid dates
        if (initialDate.toString() === 'Invalid Date' || finalDate.toString() === 'Invalid Date') {
            setType('error')
            setMessage('Las fechas seleccionadas no son válidas')
            setShow(true)
            return
        }

        // Validate dates are valid
        const formattedInitialDate = moment(initialDate)
        const formattedFinalDate = moment(finalDate)

        setIsLoading(true)
        try {
            // Log the exact values we're sending
            const params = {
                initialDate: formattedInitialDate.format('YYYY-MM-DD'),
                finalDate: formattedFinalDate.format('YYYY-MM-DD'),
                fileType,
                typeKardex,
            }
            console.log('Sending params:', params)

            const response = await axios({
                method: 'GET',
                url: `${import.meta.env.VITE_API_URL}kardex/pdt-file/`,
                params,
                responseType: 'blob',
                headers: {
                    'Authorization': `JWT ${access}`,
                    'Accept': '*/*',
                    // Add content type header
                    'Content-Type': 'application/json',
                }
            })

            // Check if the response is an error (backend might return JSON error)
            if (response.data.type === 'application/json') {
                const reader = new FileReader()
                reader.onload = async () => {
                    const errorData = JSON.parse(reader.result as string)
                    setType('error')
                    setMessage(errorData.error || 'Error al descargar el archivo')
                    setShow(true)
                }
                reader.readAsText(response.data)
                return
            }

            // Get the filename from headers or create default one based on file type
            const contentDisposition = response.headers['content-disposition']
            let filename
            if (contentDisposition) {
                filename = contentDisposition.split('filename=')[1].replace(/"/g, '')
            } else {
                // Default filenames based on type
                const extensions = {
                    1: 'act',
                    2: 'bie',
                    3: 'otg',
                    4: 'mpa',
                    5: 'for',
                    6: 'lib'
                }
                filename = `PDT_${formattedInitialDate.format('DDMMYYYY')}_${formattedFinalDate.format('DDMMYYYY')}.${extensions[fileType as keyof typeof extensions]}`
            }

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
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
            console.error('Full error details:', {
                config: error.config,
                request: error.request,
                response: error.response,
                message: error.message
            })
            console.error('Error downloading file:', error)
            setType('error')
            
            // Log the full error response for debugging
            console.log('Full error response:', error.response)
            console.log('Error response data:', error.response?.data)
            console.log('Error response headers:', error.response?.headers)
            
            let errorMessage = 'Error al descargar el archivo'
            
            if (error.response?.data instanceof Blob) {
                const reader = new FileReader()
                reader.onload = () => {
                    const result = reader.result as string
                    console.log('Error blob decoded:', result)
                    try {
                        const errorData = JSON.parse(result)
                        console.log('Error data parsed:', errorData)
                        setMessage(errorData.error || 'Error al descargar el archivo')
                    } catch (e) {
                        console.log('Raw error text:', result)
                        setMessage('Error al descargar el archivo')
                    }
                    setShow(true)
                }
                reader.readAsText(error.response.data)
            } else {
                console.log('Direct error data:', error.response?.data)
                setMessage(error.response?.data?.error || 'Error al descargar el archivo')
                setShow(true)
            }
        } finally {
            setIsLoading(false)
        }
    }
  return (
    <div className=" grid grid-cols-5 gap-4 justify-center items-center text-center my-6 px-8 py-4 mx-6 text-xs">
        <button 
            onClick={() => handleDownload({ fileType: 1 })}
            className="flex justify-center items-center gap-2 hover:bg-slate-300 w-[100px] cursor-pointer bg-slate-200 rounded-md p-2 transition-all duration-300">
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <File className="w-4 h-4" />}
            <p>Act</p>
        </button>
        <button 
            onClick={() => handleDownload({ fileType: 2 })}
            className="flex justify-center items-center gap-2 hover:bg-slate-300 w-[100px] cursor-pointer bg-slate-200 rounded-md p-2 transition-all duration-300">
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <File className="w-4 h-4" />}
            <p>Bie</p>
        </button>
        
        <button 
            onClick={() => handleDownload({ fileType: 3 })}
            className="flex justify-center items-center gap-2 hover:bg-slate-300 w-[100px] cursor-pointer bg-slate-200 rounded-md p-2 transition-all duration-300">
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <File className="w-4 h-4" />}
            <p>Otg</p>
        </button>
        
        <button 
            onClick={() => handleDownload({ fileType: 4 })}
            className="flex justify-center items-center gap-2 hover:bg-slate-300 w-[100px] cursor-pointer bg-slate-200 rounded-md p-2 transition-all duration-300">
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <File className="w-4 h-4" />}
            <p>Mp</p>
        </button>
        <button 
            onClick={() => handleDownload({ fileType: 5 })}
            className="flex justify-center items-center gap-2 hover:bg-slate-300 w-[100px] cursor-pointer bg-slate-200 rounded-md p-2 transition-all duration-300">
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <File className="w-4 h-4" />}
            <p>Form</p>
        </button>
    </div>
  )
}

export default ArchivoPdtKardexFiles