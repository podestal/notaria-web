import { FileText, Loader2 } from 'lucide-react'
import useAuthStore from '../../../../store/useAuthStore'
import moment from 'moment'
import axios from 'axios'
import { useState } from 'react'

interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
}

const RegistroUifPlaneText = ({ dateFrom, dateTo }: Props) => {
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
                `${import.meta.env.VITE_API_URL}kardex/uif-report-plane/?initialDate=${moment(dateFrom).format('DD/MM/YYYY')}&finalDate=${moment(dateTo).format('DD/MM/YYYY')}`, 
                {
                    headers: {
                        'Authorization': `JWT ${access}`
                    },
                    responseType: 'json' // Change back to json since backend returns JSON
                }
            )

            // The response.data should contain your file content
            console.log('Response data:', response.data);
            
            // Extract filename and content from the response
            const { filename, content } = response.data;

            // Decode the base64 content
            const fileContent = atob(content);
            
            // Create blob from the decoded content
            const blob = new Blob([fileContent], { type: 'text/plain' })
            
            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            
            // Use the filename from the response
            link.download = filename
            
            // Trigger download
            document.body.appendChild(link)
            link.click()
            
            // Cleanup
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            
            console.log('File downloaded successfully')
        } catch (error) {
            console.error('Error downloading file:', error)
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