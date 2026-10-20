import { FileDown, Loader2 } from "lucide-react"
import axios from "axios"
import moment from "moment"
import { useState } from "react"
import { motion } from "framer-motion"
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore"
import useAuthStore from "../../../../../store/useAuthStore"

interface Props {
    initialDate: Date | undefined
    finalDate: Date | undefined
    typeKardex: number
}

const FILE_TYPES = [
    { id: 1, code: "ACT", label: "Actos" },
    { id: 2, code: "BIE", label: "Bienes" },
    { id: 3, code: "OTG", label: "Otros gastos" },
    { id: 4, code: "MPA", label: "Medios de pago" },
    { id: 5, code: "FOR", label: "Formato" },
] as const

const ArchivoPdtKardexFiles = ({ initialDate, finalDate, typeKardex }: Props) => {
    const access = useAuthStore(s => s.access_token) || ''
    const [loadingType, setLoadingType] = useState<number | null>(null)
    const { setType, setMessage, setShow } = useNotificationsStore()

    const handleDownload = async ({ fileType }: { fileType: number }) => {
        if (!initialDate || !finalDate) {
            setType('error')
            setMessage('Por favor seleccione las fechas')
            setShow(true)
            return
        }

        if (initialDate.toString() === 'Invalid Date' || finalDate.toString() === 'Invalid Date') {
            setType('error')
            setMessage('Las fechas seleccionadas no son válidas')
            setShow(true)
            return
        }

        const formattedInitialDate = moment(initialDate)
        const formattedFinalDate = moment(finalDate)

        setLoadingType(fileType)
        try {
            const params = {
                initialDate: formattedInitialDate.format('YYYY-MM-DD'),
                finalDate: formattedFinalDate.format('YYYY-MM-DD'),
                fileType,
                typeKardex,
            }

            const response = await axios({
                method: 'GET',
                url: `${import.meta.env.VITE_API_URL}kardex/pdt-file/`,
                params,
                responseType: 'blob',
                headers: {
                    'Authorization': `JWT ${access}`,
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                }
            })

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

            const contentDisposition = response.headers['content-disposition']
            let filename
            if (contentDisposition) {
                filename = contentDisposition.split('filename=')[1].replace(/"/g, '')
            } else {
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

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(link)

            setType('success')
            setMessage('Archivo descargado exitosamente')
            setShow(true)
        } catch (error: any) {
            let errorMessage = 'Error al descargar el archivo'

            if (error.response?.data instanceof Blob) {
                const reader = new FileReader()
                reader.onload = () => {
                    const result = reader.result as string
                    try {
                        const errorData = JSON.parse(result)
                        setMessage(errorData.error || errorMessage)
                    } catch {
                        setMessage(errorMessage)
                    }
                    setShow(true)
                }
                reader.readAsText(error.response.data)
            } else {
                setMessage(error.response?.data?.error || errorMessage)
                setShow(true)
            }
            setType('error')
        } finally {
            setLoadingType(null)
        }
    }

  return (
    <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Descargar archivos planos
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {FILE_TYPES.map((file, i) => {
                const busy = loadingType === file.id
                const disabled = loadingType != null
                return (
                    <motion.button
                        key={file.id}
                        type="button"
                        onClick={() => handleDownload({ fileType: file.id })}
                        disabled={disabled}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.08 + i * 0.04 }}
                        whileHover={disabled ? undefined : { y: -2 }}
                        whileTap={disabled ? undefined : { scale: 0.97 }}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/60 disabled:cursor-wait disabled:opacity-60"
                    >
                        {busy
                            ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-emerald-600" />
                            : <FileDown className="h-4 w-4 shrink-0 text-emerald-600" />}
                        <span>
                            <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                {file.code}
                            </span>
                            <span className="block text-xs font-semibold text-slate-800">{file.label}</span>
                        </span>
                    </motion.button>
                )
            })}
        </div>
    </div>
  )
}

export default ArchivoPdtKardexFiles
