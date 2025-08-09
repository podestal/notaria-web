import { FileText } from "lucide-react";
import useAuthStore from "../../../../store/useAuthStore";
import axios from "axios";

interface Props {
    name: string
    url: string
    params: Record<string, string>
}

const AbrirDocumento = ({ name, url, params }: Props) => {

    const docsURL = import.meta.env.VITE_DOC_URL
    const access = useAuthStore((s) => s.access_token) || ''
  
    const handleOpenDocument = async () => {
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
          console.log('Opening document in Word:', response.data.url);
          console.log('response data', response.data);
  
          const wordUrl = `ms-word:ofe|u|${response.data.url}`;
          console.log('whole command', wordUrl);
          window.open(wordUrl, '_blank');
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
        }
  
      } catch (error) {
        console.error('Error opening Word document:', error);
      }
    };
  return (
    <div 
        onClick={handleOpenDocument}
        className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
        <FileText className="text-xl text-slate-50"/>
        <p className="text-xs">Ver Doc</p>
    </div>
  )
}

export default AbrirDocumento