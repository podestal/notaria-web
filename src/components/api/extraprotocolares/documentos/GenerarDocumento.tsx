import axios from "axios";
import useAuthStore from "../../../../store/useAuthStore";
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore";
import { FileCog, Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
    name: string
    url: string
    params: Record<string, string>
}

const GenerarDocumento = ({ name, url, params }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const access = useAuthStore((s) => s.access_token) || ''
    const { setType, setMessage, setShow } = useNotificationsStore();
    const docsURL = import.meta.env.VITE_DOC_URL

    const showNotification = (type: 'success' | 'error', message: string) => {
        setType(type);
        setMessage(message);
        setShow(true);
    };

    const handleOpenDocument = async () => {
        if (isLoading) return; // Prevent multiple clicks during loading
        
        setIsLoading(true);
        
        try {
          const isWindows = /Windows/.test(navigator.userAgent);
          const mode = isWindows ? 'open' : 'download';
  
          console.log(`OS: ${isWindows ? 'Windows' : 'Other'}, Mode: ${mode}`);
          
          const response = await axios.get(
            `${docsURL}extraprotocolares/${url}/`,
            {
              responseType: mode === 'download' ? 'blob' : 'json',
              headers: {
                'Authorization': `JWT ${access}`,
              },
              params: {
                mode,
                ...params
              }
            }
          );
  
          if (mode === 'open' && response.data.mode === 'open' && response.data.url) {
            // Windows: Open in Word using the secure backend URL
            const wordUrl = `ms-word:ofe|u|${response.data.url}`;
            window.open(wordUrl, '_blank');
            showNotification('success', 'Documento abierto en Word exitosamente');
            return;
          } else {
            // Download mode (iOS, Mac, Linux, or fallback)
            const blob = new Blob([response.data], {
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `__PROY__${name}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
            showNotification('success', 'Documento descargado exitosamente');
          }
  
        } catch (error) {
          console.error('Error opening Word document:', error);
          showNotification('error', 'Error al generar el documento. Por favor intenta nuevamente.');
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <div 
        onClick={handleOpenDocument}
        className={`w-full flex items-center justify-between px-4 py-2 gap-1 rounded-lg mb-4 text-blue-600 transition-all duration-200 ${
            isLoading 
                ? 'bg-blue-100 cursor-not-allowed opacity-70' 
                : 'bg-blue-200 hover:opacity-85 cursor-pointer hover:bg-blue-300'
        }`}>
        {isLoading ? (
            <Loader2 className="text-xl text-blue-600 animate-spin" />
        ) : (
            <FileCog className="text-xl text-green-600"/>
        )}
        <p className="text-xs font-medium">
            {isLoading ? 'Generando...' : 'Generar'}
        </p>
    </div>
  )
}

export default GenerarDocumento