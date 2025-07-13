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
      
      // Step 1: Call Django to get the populated .docx file as a Blob
      const response = await axios.get(
        `${docsURL}documentos/open-document/?template_id=${kardex.fktemplate}&kardex=${kardex.kardex}`,
        {
          responseType: 'blob', // IMPORTANT: to get binary data
          headers: {
            'Authorization': `Bearer ${access}`,
          }
        }
      );

      // Step 2: Create a Blob URL from the downloaded file
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const blobUrl = window.URL.createObjectURL(blob);

      // Step 3: Try opening Word with ms-word protocol (will only work if the document is served from a web URL)
      // This fallback just opens the file locally
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `__PROY__${kardex.kardex}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optional: revoke URL later to clean memory
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch (error) {
      console.error('Error opening Word document:', error);
    }
  }

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