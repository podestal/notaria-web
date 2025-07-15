import { FileType } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import axios from "axios"
import { Kardex } from "../../../services/api/kardexService"

interface Props {
  kardex: Kardex
}

const DigitacionGetProyect = ({ kardex }: Props) => {

  const docsURL = import.meta.env.VITE_DOC_URL
  const access = useAuthStore((s) => s.access_token) || ''

  const handleOpenDocument = async () => {
    try {
      const isWindows = /Windows/.test(navigator.userAgent);
      const mode = isWindows ? 'open' : 'download';

      console.log(`OS: ${isWindows ? 'Windows' : 'Other'}, Mode: ${mode}`);

      const response = await axios.get(
        `${docsURL}documentos/open-document/?template_id=${kardex.fktemplate}&kardex=${kardex.kardex}&mode=${mode}`,
        {
          responseType: mode === 'download' ? 'blob' : 'json',
          headers: {
            'Authorization': `Bearer ${access}`,
          }
        }
      );

      if (mode === 'open' && response.data.mode === 'open' && response.data.url) {
        // Windows: Open in Word using the secure backend URL
        const wordUrl = `ms-word:ofe|u|${response.data.url}`;
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
        link.download = `__PROY__${kardex.kardex}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
      }

    } catch (error) {
      console.error('Error opening Word document:', error);
      alert('Error opening document. Please try again.');
    }
  };

  return (
    <div className="w-full flex items-start justify-center">
        <button 
            onClick={handleOpenDocument}
            type="button"
            className="text-xs text-blue-600 pb-2 cursor-pointer hover:underline transform hover:scale-105 hover:text-blue-700 transition-all duration-300"> 
            <FileType />
        </button>
    </div>
  )
}

export default DigitacionGetProyect